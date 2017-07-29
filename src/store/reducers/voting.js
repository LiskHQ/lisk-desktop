import actionTypes from '../../constants/actions';

const _removeFromList = (list, item) => {
  const address = item.address;
  return list.filter(delegate => delegate.address !== address);
};
/**
 *
 * @param {Array} state
 * @param {Object} action
 */
const voting = (state = { votedList: [], unvotedList: [] }, action) => {
  switch (action.type) {
    case actionTypes.addToVotedList:
      return Object.assign({}, state, {
        votedList: [...state.votedList, action.data],
      });
    case actionTypes.removeFromVotedList:
      return Object.assign({}, state, {
        votedList: _removeFromList(state.votedList, action.data),
      });
    case actionTypes.addToUnvotedList:
      return Object.assign({}, state, {
        unvotedList: [...state.unvotedList, action.data],
      });
    case actionTypes.removeFromUnvotedList:
      return Object.assign({}, state, {
        unvotedList: _removeFromList(state.unvotedList, action.data),
      });
    default:
      return state;
  }
};

export default voting;
