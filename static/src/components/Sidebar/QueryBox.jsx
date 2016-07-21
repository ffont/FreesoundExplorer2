import React from 'react';
import '../../stylesheets/QueryBox.scss';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { DEFAULT_MAX_RESULTS } from '../../constants';

const propTypes = {
  onSetMapDescriptor: React.PropTypes.func,
  onSetMaxResults: React.PropTypes.func,
  onQuerySubmit: React.PropTypes.func,
  maxResults: React.PropTypes.number,
};

class QueryBox extends React.Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }
  render() {
    return (
      <div id="query-box" className="query-box">
        <form id="query-form" className="query-form">
          <input
            id="query-terms-input"
            className="query-terms-input"
            type="text"
            placeholder="query terms, e.g.: instrument note"
            ref="query"
          />
          <button
            id="search-button"
            className="search-button"
            onClick={(evt) => {
              evt.preventDefault();
              this.props.onQuerySubmit(this.refs.query.value);
            }}
          >
            <i className="fa fa-arrow-circle-right fa-lg" aria-hidden="true" />
          </button>
          <select
            id="map-descriptors-selector"
            className="map-descriptors-selector"
            onChange={this.props.onSetMapDescriptor}
          >
            <option value="lowlevel.mfcc.mean">MFCC</option>
            <option value="lowlevel.barkbands.mean">Barkbands</option>
            <option value="lowlevel.erb_bands.mean">ERB bands</option>
            <option value="lowlevel.frequency_bands.mean">Frequency bands</option>
            <option value="lowlevel.gfcc.mean">GFCC</option>
            <option value="sfx.tristimulus.mean">Tristimulus</option>
            <option value="tonal.hpcp.mean">HPCP</option>
            <option value="lowlevel.spectral_contrast.mean">Spectral contrast</option>
            <option value="lowlevel.scvalleys.mean">SC Valleys</option>
          </select>
          <input
            id="max-results-slider"
            className="max-results-slider"
            type="range" onChange={this.props.onSetMaxResults}
            min="20" max="450" defaultValue={DEFAULT_MAX_RESULTS} step="1"
          /><span>{this.props.maxResults}</span>
        </form>
      </div>
    );
  }
}


QueryBox.propTypes = propTypes;
export default QueryBox;