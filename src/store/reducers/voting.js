import actionTypes from '../../constants/actions';

const removeFromList = (list, item) => {
  const address = item.address;
  return list.filter(delegate => delegate.address !== address);
};
const findItemInList = (list, item) => {
  const username = item.username;
  let idx = -1;
  list.forEach((delegate, index) => {
    if (delegate.address === username) {
      idx = index;
    }
  });
  console.log(idx);
  return idx;
};
/**
 *
 * @param {Array} state
 * @param {Object} action
 */
const voting = (state = { votedList: [], unvotedList: [] }, action) => {
  switch (action.type) {
    case actionTypes.addToVotedList:
      if (findItemInList(state.votedList, action.data) > -1) {
        console.log(action.data);
        return Object.assign({}, state, {
          votedList: [...removeFromList(state.votedList, action.data), action.data],
        });
      }
      return Object.assign({}, state, {
        votedList: [...state.votedList, action.data],
      });
    case actionTypes.removeFromVotedList:
      return Object.assign({}, state, {
        votedList: removeFromList(state.votedList, action.data),
      });
    case actionTypes.addToUnvotedList:
      if (findItemInList(state.unvotedList, action.data) > -1) {
        return Object.assign({}, state, {
          unvotedList: [...removeFromList(state.unvotedList, action.data), action.data],
        });
      }
      return Object.assign({}, state, {
        unvotedList: [...state.unvotedList, action.data],
      });
    case actionTypes.removeFromUnvotedList:
      return Object.assign({}, state, {
        unvotedList: removeFromList(state.unvotedList, action.data),
      });
    default:
      return state;
  }
};

export default voting;
