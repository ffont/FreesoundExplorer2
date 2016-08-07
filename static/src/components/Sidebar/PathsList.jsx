import React from 'react';
import AudioTickListener from '../App/AudioTickListener';
import '../../stylesheets/PathsList.scss';
import { getRandomElement, truncatedString } from '../../utils/misc';
import { MESSAGE_STATUS } from '../../constants';
import { connect } from 'react-redux';
import { displaySystemMessage, setPathSync, addPath, startStopPath,
  setPathCurrentlyPlaying, selectPath, deleteSoundFromPath } from '../../actions';

const propTypes = {
  paths: React.PropTypes.array,
  selectedPath: React.PropTypes.number,
  sounds: React.PropTypes.array,
  startStopPlayingPath: React.PropTypes.func,
  updateSelectedSound: React.PropTypes.func,
  addPath: React.PropTypes.func,
  displaySystemMessage: React.PropTypes.func,
  setPathSync: React.PropTypes.func,
  startStopPath: React.PropTypes.func,
  setPathCurrentlyPlaying: React.PropTypes.func,
  selectPath: React.PropTypes.func,
  deleteSoundFromPath: React.PropTypes.func,
  playSoundByFreesoundId: React.PropTypes.func,
  audioContext: React.PropTypes.object,
};

class PathsList extends AudioTickListener {
  createNewPath() {
    if (this.props.sounds.length) {
      const pathSounds = [];
      const nSounds = 2 + Math.floor(Math.random() * 3);
      [...Array(nSounds).keys()].map(() => pathSounds.push(getRandomElement(this.props.sounds)));
      this.props.addPath(pathSounds);
    } else {
      this.props.displaySystemMessage('A new path can not be created until there are some sounds ' +
        'in the map', MESSAGE_STATUS.ERROR);
    }
  }

  onAudioTick(bar, beat, tick, time) {
    for (let i = 0; i < this.props.paths.length; i++) {
      if (this.props.paths[i].isPlaying) {
        if (this.props.paths[i].syncMode === 'beat') {
          if (tick % 4 === 0) {
            if (this.props.paths[i].currentlyPlaying.willFinishAt === undefined) {
              this.playNextSoundFromPath(undefined, i, time);
            } else {
              if (this.props.paths[i].currentlyPlaying.willFinishAt <= time) {
                this.playNextSoundFromPath(undefined, i, time);
              }
            }
          }
        }
        if (this.props.paths[i].syncMode === '2xbeat') {
          if (tick % 8 === 0) {
            if (this.props.paths[i].currentlyPlaying.willFinishAt === undefined) {
              this.playNextSoundFromPath(undefined, i, time);
            } else {
              if (this.props.paths[i].currentlyPlaying.willFinishAt <= time) {
                this.playNextSoundFromPath(undefined, i, time);
              }
            }
          }
        }
        if (this.props.paths[i].syncMode === 'bar') {
          if (tick === 0) {
            if (this.props.paths[i].currentlyPlaying.willFinishAt === undefined) {
              this.playNextSoundFromPath(undefined, i, time);
            } else {
              if (this.props.paths[i].currentlyPlaying.willFinishAt <= time) {
                this.playNextSoundFromPath(undefined, i, time);
              }
            }
          }
        }
      }
    }
  }

  componentWillUpdate(nextProps, nextState) {
    // For some reason we need to hook componentWillUpdate to see if a path should
    // start playing (state changed from isPlaying = false to isPlaying = true) and call
    // this.playNextSoundFromPath... apparently if we do it after startStopPath this.props is
    // not updated accordingly or fast enough... TODO: investigate this...
    // Same thing we do for when changing sync mode to 'no'
    if (nextProps.paths.length > 0) {
      for (let i = 0; i < this.props.paths.length; i++) {
        if ((!this.props.paths[i].isPlaying) && (nextProps.paths[i].isPlaying)) {
          this.playNextSoundFromPath(nextProps.paths[i], i);
        }
        if ((this.props.paths[i].syncMode !== 'no') && (nextProps.paths[i].syncMode === 'no')) {
          if (nextProps.paths[i].isPlaying) {
            if (nextProps.paths[i].currentlyPlaying.willFinishAt === undefined) {
              this.playNextSoundFromPath(nextProps.paths[i], i);
            } else {
              this.playNextSoundFromPath(nextProps.paths[i], i,
                nextProps.paths[i].currentlyPlaying.willFinishAt);
            }
          }
        }
      }
    }
  }

  playNextSoundFromPath(path, pathIdx, time) {
    let myPath = undefined;
    if (path === undefined) {
      myPath = this.props.paths[pathIdx];
    } else {
      myPath = path;
    }
    if (myPath !== undefined) {
      if (myPath.isPlaying) {
        let nextSoundToPlayIdx;
        if ((myPath.currentlyPlaying.soundIdx === undefined) ||
          (myPath.currentlyPlaying.soundIdx + 1 >= myPath.sounds.length)) {
          nextSoundToPlayIdx = 0;
        } else {
          nextSoundToPlayIdx = myPath.currentlyPlaying.soundIdx + 1;
        }
        const nextSoundToPlay = myPath.sounds[nextSoundToPlayIdx];
        const willFinishAt = (time === undefined) ?
          this.props.audioContext.currentTime + nextSoundToPlay.duration :
          time + nextSoundToPlay.duration;
        this.props.setPathCurrentlyPlaying(pathIdx, nextSoundToPlayIdx, willFinishAt);
        if (myPath.syncMode === 'no') {
          this.props.playSoundByFreesoundId(nextSoundToPlay.id, () => {
            this.playNextSoundFromPath(undefined, pathIdx);
          });
        } else {
          // If synched to metronome, sounds will be triggered by onAudioTick events
          if (time !== undefined) {
            this.props.playSoundByFreesoundId(
              myPath.sounds[nextSoundToPlayIdx].id, undefined, undefined, undefined, time);
          }
        }
      }
    }
  }

  startStopPlayingPath(pathIdx) {
    if (this.props.paths[pathIdx].isPlaying) {
      this.props.startStopPath(pathIdx, false);
    } else {
      if (this.props.paths[pathIdx].sounds.length) {
        this.props.startStopPath(pathIdx, true);
      }
    }
  }

  setPathSyncMode(pathIdx, newMode) {
    this.props.setPathSync(pathIdx, newMode);
  }

  render() {
    return (
      <ul className="paths-list">
        {this.props.paths.map((path, pathIdx) =>
          <li key={pathIdx}>
            <button onClick={() => this.startStopPlayingPath(pathIdx)} >
              {(path.isPlaying) ?
                <i className="fa fa-pause fa-lg" aria-hidden="true" /> :
                <i className="fa fa-play fa-lg" aria-hidden="true" />}
            </button>
            <a className="cursor-pointer" onClick={() => this.props.selectPath(pathIdx)} >
              {path.name} ({path.sounds.length} sounds)
            </a>&nbsp;
            <div className="button-group">
              <button
                className={(path.syncMode === 'no') ? 'active' : ''}
                onClick={() => this.setPathSyncMode(pathIdx, 'no')}
              >none</button>
              <button
                className={(path.syncMode === 'beat') ? 'active' : ''}
                onClick={() => this.setPathSyncMode(pathIdx, 'beat')}
              >1/4</button>
              <button
                className={(path.syncMode === '2xbeat') ? 'active' : ''}
                onClick={() => this.setPathSyncMode(pathIdx, '2xbeat')}
              >1/2</button>
              <button
                className={(path.syncMode === 'bar') ? 'active' : ''}
                onClick={() => this.setPathSyncMode(pathIdx, 'bar')}
              >1</button>
            </div>
            {((pathIdx === this.props.selectedPath) && (path.sounds.length === 0)) ?
              <ul className="sounds-list"><li>Select a sound and click 'Add to path'</li></ul>
                : false
            }
            {(pathIdx === this.props.selectedPath) ?
              <ul className="sounds-list">
                {path.sounds.map((sound, soundIndex) => {
                  // Computed vars here
                  return (
                    <li key={soundIndex}>
                      <a
                        className="cursor-pointer"
                        onClick={() => this.props.updateSelectedSound(sound.id)}
                      >{truncatedString(sound.name, 40)}</a>
                      <a onClick={() => this.props.deleteSoundFromPath(soundIndex, pathIdx)} >
                        &nbsp;<i className="fa fa-trash-o fa-lg" aria-hidden="true" />
                      </a>
                    </li>
                  );
                })}
              </ul> : ''}
          </li>
        )}
        <li>
          <button onClick={() => this.createNewPath()} >
            <i className="fa fa-plus fa-lg" aria-hidden="true" />
          </button>
        </li>
      </ul>
    );
  }
}

const mapStateToProps = (state) => {
  const { paths, selectedPath } = state.paths;
  return { paths, selectedPath };
};

PathsList.propTypes = propTypes;
export default connect(mapStateToProps, {
  addPath, displaySystemMessage, setPathSync, startStopPath, setPathCurrentlyPlaying,
  selectPath, deleteSoundFromPath,
}, undefined, { withRef: true })(PathsList);
