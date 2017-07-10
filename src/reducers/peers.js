import actionTypes from '../constants/actions';

/**
 *
 * @param {Array} state
 * @param {Object} action
 */
const peers = (state = {}, action) => {
  switch (action.type) {
    case actionTypes.activePeerSet:
      return Object.assign({}, state, { active: action.data });
    case actionTypes.activePeerReset:
      return Object.assign({}, state, { active: null });
    default:
      return state;
  }
};

export default peers;
