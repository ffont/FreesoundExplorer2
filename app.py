from flask import Flask, render_template, jsonify, request, make_response
import freesound
import settings
import json

app = Flask(__name__)
fs_client = freesound.FreesoundClient()
fs_client.set_token(settings.FS_CLIENT_SECRET, "token")


@app.route('/')
def index():
    return render_template('index.html')

@app.route('/search')
def search():
    query = request.args.get('query', '')
    page = int(request.args.get('page', 1))
    fields = "id,previews,name,analysis,url,username"
    page_size = 150
    group_by_pack = 0
    filt = "duration:[0%20TO%202]"
    descriptors = "sfx.tristimulus.mean," + request.args.get('extra_descriptors', '')

    if settings.FAKE_RESPONSE:
        if page == 1:
            response = make_response(jsonify(json.load(open('other/fake_response.json', 'r'))), 200)
        else:
            response = make_response(jsonify({"detail": "Not found"}), 404)
    else:
        try:
            fs_response = fs_client.text_search(
                query=query,
                filter=filt,
                fields=fields,
                page=page,
                page_size=page_size,
                group_by_pack=group_by_pack,
                descriptors=descriptors)
            response = make_response(jsonify(fs_response.as_dict()), 200)  # use .as_dict() to directly pass loaded json
        except freesound.FreesoundException as e:
            response = make_response(jsonify(e.detail), e.code)

    return response

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=settings.PORT, debug=settings.DEBUG)
