import actionTypes from '../../constants/actions';

/**
 *
 * @param {Array} state
 * @param {Object} action
 */
const toaster = (state = {}, action) => {
  switch (action.type) {
    case actionTypes.toastDisplayed:
      return Object.assign({}, state, action.data);
    case actionTypes.toastHidden:
      return {};
    default:
      return state;
  }
};

export default toaster;
