import actionTypes from '../../constants/actions';

const removeFromList = (list, item) => {
  const address = item.address;
  return list.filter(delegate => delegate.address !== address);
};
const findItemInList = (list, item) => {
  const address = item.address;
  let idx = -1;
  list.forEach((delegate, index) => {
    if (delegate.address === address) {
      idx = index;
    }
  });
  return idx;
};
/**
 *
 * @param {Array} state
 * @param {Object} action
 */
const voting = (state = { votedList: [], unvotedList: [] }, action) => {
  switch (action.type) {
    case actionTypes.addToVoteList:
      if (action.data.voted) {
        return Object.assign({}, state, {
          unvotedList: [...removeFromList(state.unvotedList, action.data)],
        });
      }
      if (findItemInList(state.votedList, action.data) > -1) {
        return state;
      }
      return Object.assign({}, state, {
        votedList: [
          ...state.votedList,
          Object.assign(action.data, { selected: true }),
        ],
      });
    case actionTypes.removeFromVoteList:
      if (!action.data.voted) {
        return Object.assign({}, state, {
          votedList: [...removeFromList(state.votedList, action.data)],
        });
      }
      if (findItemInList(state.unvotedList, action.data) > -1) {
        return state;
      }
      return Object.assign({}, state, {
        unvotedList: [
          ...state.unvotedList,
          Object.assign(action.data, { selected: false }),
        ],
      });
    default:
      return state;
  }
};

export default voting;
