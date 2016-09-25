export const DEFAULT_QUERY = 'instruments';
export const DEFAULT_MAX_RESULTS = 60;
export const DEFAULT_MIN_DURATION = 0;
export const DEFAULT_MAX_DURATION = 5;
export const DEFAULT_DESCRIPTOR = 'lowlevel.mfcc.mean';
export const PERFORM_QUERY_AT_MOUNT = false;

export const USE_LOCAL_FONTAWESOME = false;

export const URLS = {
  SAVE_SESSION: '/save/',
  LOAD_SESSION: '/load/',
  AVAILABLE_SESSIONS: '/available/',
};

export const DEFAULT_MESSAGE_DURATION = 4000;
export const MESSAGE_STATUS = {
  INFO: 'info',
  SUCCESS: 'success',
  ERROR: 'error',
  PROGRESS: 'progress',
};

export const SIDEBAR_TABS = {
  HOME: 'home',
  SEARCH: 'search',
  PATHS: 'paths',
  SPACES: 'spaces',
  MIDI: 'midi',
  INFO: 'info',
};

export const DEFAULT_SIDEBAR_TAB = SIDEBAR_TABS.SEARCH;

export const MODAL_PAGES = {
  LOAD_SESSION: 'loadSession',
  ERROR: 'error',
};

export const REQUEST_POOL_SIZE = 50;

export const N_MIDI_MESSAGES_TO_KEEP = 10;
export const MIDI_MESSAGE_INDICATOR_DURATION = 1000;

export const MIN_ZOOM = 0.05;
export const MAX_ZOOM = 15;
export const MAP_SCALE_FACTOR = 20;

export const MAX_TSNE_ITERATIONS = 150;
export const TSNE_CONFIG = {
  epsilon: 10,
  perplexity: 10,
  dim: 2,
};

export const DEFAULT_TRUNCATED_STRING_LENGTH = 40;

export const START_METRONOME_AT_MOUNT = true;
export const DEFAULT_TEMPO = 120.0;
export const LOOKAHEAD = 25; // How often we'll call the scheduler function (in milliseconds)
export const SCHEDULEAHEADTIME = 0.2; // How far we schedule notes from lookahead call (in seconds)
export const TICKRESOLUTION = 16; // 16 for 16th note or 32 for 32th note