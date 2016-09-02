import { combineReducers } from 'redux';
import { ADD_PATH, SET_PATH_SYNC, STARTSTOP_PATH,
  SET_PATH_CURRENTLY_PLAYING, SELECT_PATH, DELETE_SOUND_FROM_PATH,
  ADD_SOUND_TO_PATH, CLEAR_ALL_PATHS, SET_PATH_WAIT_UNTIL_FINISHED,
  SET_PATH_ACTIVE, REMOVE_SOUND } from '../actions/actionTypes';

const path = (state = {}, action) => {
  if (state.id !== action.pathID) {
    return state;
  }
  // if you get here, you are the lucky path the action is referring to ;)
  switch (action.type) {
    case SET_PATH_SYNC: {
      return Object.assign({}, state, { syncMode: action.syncMode });
    }
    case STARTSTOP_PATH: {
      const currentlyPlaying = (action.isPlaying) ? state.currentlyPlaying : {
        soundIDx: undefined,
        willFinishAt: undefined,
      };
      return Object.assign({}, state, { isPlaying: action.isPlaying, currentlyPlaying });
    }
    case SET_PATH_CURRENTLY_PLAYING: {
      return Object.assign({}, state, {
        currentlyPlaying: {
          // TODO: we shouldn't use soundIDx, only soundID
          soundIDx: action.soundIDx,
          willFinishAt: action.willFinishAt,
        },
      });
    }
    case SET_PATH_ACTIVE: {
      return Object.assign({}, state, { isActive: action.isActive });
    }
    case DELETE_SOUND_FROM_PATH: {
      return Object.assign({}, state, {
        sounds: state.sounds.filter(id => id !== action.soundID),
      });
    }
    case ADD_SOUND_TO_PATH: {
      return Object.assign({}, state, { sounds: [...state.sounds, action.soundID] });
    }
    case SET_PATH_WAIT_UNTIL_FINISHED: {
      return Object.assign({}, state, { waitUntilFinished: action.waitUntilFinished });
    }
    default:
      return state;
  }
};

const paths = (state = [], action) => {
  switch (action.type) {
    case ADD_PATH: {
      const { pathID, sounds } = action;
      let pathName = String.fromCharCode(65 + (state.length % 26));
      if (Math.floor(state.length / 26) > 0) {
        pathName += 1 + Math.floor(state.length / 26);
      }
      return [...state,
        {
          id: pathID,
          name: pathName,
          isActive: true,
          isPlaying: false,
          syncMode: 'beat',
          waitUntilFinished: true,
          currentlyPlaying: {
            soundIDx: undefined,
            willFinishAt: undefined,
          },
          sounds,
        },
      ];
    }
    case SET_PATH_SYNC:
    case STARTSTOP_PATH:
    case SET_PATH_CURRENTLY_PLAYING:
    case SET_PATH_ACTIVE:
    case DELETE_SOUND_FROM_PATH:
    case ADD_SOUND_TO_PATH:
    case SET_PATH_WAIT_UNTIL_FINISHED: {
      return state.map(curPath => path(curPath, action));
    }
    case REMOVE_SOUND: {
      return state.map(curPath =>
        path(curPath, {
          type: DELETE_SOUND_FROM_PATH, soundID: action.soundID, pathID: curPath.id })
      );
    }
    case CLEAR_ALL_PATHS: {
      return [];
    }
    default:
      return state;
  }
};

const selectedPath = (state = null, action) => {
  switch (action.type) {
    case ADD_PATH: {
      return action.pathID;
    }
    case SELECT_PATH: {
      return action.pathID;
    }
    case CLEAR_ALL_PATHS: {
      return null;
    }
    default:
      return state;
  }
};

export default combineReducers({ paths, selectedPath });
