import actionTypes from '../actions/actionTypes';

/**
 *
 * @param {Array} state
 * @param {Object} action
 */
const dialog = (state = [], action) => {
  switch (action.type) {
    case actionTypes.loadingStarted:
      return [...state, action.data];
    case actionTypes.loadingFinished:
      return state.filter(item => item !== action.data);
    default:
      return state;
  }
};

export default dialog;
