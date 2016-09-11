import { TOGGLE_MODAL, SET_MODAL_PAGE } from './actions';

const initialState = {
  isVisible: false,
  currentPage: undefined,
};

const modal = (state = initialState, action) => {
  switch (action.type) {
    case TOGGLE_MODAL: {
      return Object.assign({}, state, { isVisible: !state.isVisible });
    }
    case SET_MODAL_PAGE: {
      return Object.assign({}, state, { currentPage: action.newPage });
    }
    default:
      return state;
  }
};

export default modal;