import actionTypes from '../../constants/actions';

/**
 *
 * @param {Array} state
 * @param {Object} action
 */
const dialog = (state = {}, action) => {
  switch (action.type) {
    case actionTypes.dialogDisplayed:
      return Object.assign({}, state, action.data);
    case actionTypes.dialogHidden:
      return {};
    default:
      return state;
  }
};

export default dialog;
