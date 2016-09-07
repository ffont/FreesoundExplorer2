import { UPDATE_METRONOME_STATUS, SET_TEMPO, STARTSTOP_METRONOME,
  SET_PLAY_SOUND } from '../actions/actionTypes';
import { DEFAULT_TEMPO } from '../constants';
import sessions from './sessions';

const initialState = {
  bar: 1,
  beat: 0,
  tick: 0,
  tempo: DEFAULT_TEMPO,
  isPlaying: false,
  playSound: false,
};

function metronome(state = initialState, action) {
  switch (action.type) {
    case UPDATE_METRONOME_STATUS: {
      return Object.assign({}, state, {
        bar: action.bar,
        beat: action.beat,
        tick: action.tick,
      });
    }
    case SET_TEMPO: {
      return Object.assign({}, state, {
        tempo: action.tempo,
      });
    }
    case SET_PLAY_SOUND: {
      return Object.assign({}, state, {
        playSound: action.playSound,
      });
    }
    case STARTSTOP_METRONOME: {
      return Object.assign({}, state, {
        isPlaying: action.isPlaying,
      });
    }
    default:
      return state;
  }
}

export default sessions(metronome);
