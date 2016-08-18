import makeActionCreator from './makeActionCreator';
import * as at from './actionTypes';

export const updateMetronomeStatus = makeActionCreator(at.UPDATE_METRONOME_STATUS,
  'bar', 'beat', 'tick');

export const setTempo = makeActionCreator(at.SET_TEMPO,
  'tempo');

export const startStopMetronome = makeActionCreator(at.STARTSTOP_METRONOME,
  'isPlaying');

export const addPath = makeActionCreator(at.ADD_PATH,
  'sounds');

export const setPathSync = makeActionCreator(at.SET_PATH_SYNC,
  'pathId', 'syncMode');

export const startStopPath = makeActionCreator(at.STARTSTOP_PATH,
  'pathId', 'isPlaying');

export const setPathCurrentlyPlaying = makeActionCreator(at.SET_PATH_CURRENTLY_PLAYING,
  'pathId', 'soundIdx', 'willFinishAt');

export const selectPath = makeActionCreator(at.SELECT_PATH,
  'pathId');

export const deleteSoundFromPath = makeActionCreator(at.DELETE_SOUND_FROM_PATH,
  'pathSoundIdx', 'pathId');

export const addSoundToPath = makeActionCreator(at.ADD_SOUND_TO_PATH,
  'sound', 'pathId');

export const clearAllPaths = makeActionCreator(at.CLEAR_ALL_PATHS);

export const setPathWaitUntilFinished = makeActionCreator(at.SET_PATH_WAIT_UNTIL_FINISHED,
  'pathId', 'waitUntilFinished');