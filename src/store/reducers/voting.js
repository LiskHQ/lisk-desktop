import actionTypes from '../../constants/actions';
/**
 * remove a gelegate from list of delegates
 *
 * @param {array} list - list for delegates
 * @param {object} item - a delegates that we want to remove it
 */
const removeFromList = (list, item) => {
  const address = item.address;
  return list.filter(delegate => delegate.address !== address);
};
/**
 * find index of a gelegate in list of delegates
 *
 * @param {array} list - list for delegates
 * @param {object} item - a delegates that we want to find its index
 */
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
 * voting reducer
 *
 * @param {Object} state
 * @param {Object} action
 */
const voting = (state = { votedList: [], unvotedList: [] }, action) => {
  switch (action.type) {
    case actionTypes.addedToVoteList:
      if (action.data.voted) {
        return Object.assign({}, state, {
          refresh: false,
          unvotedList: [...removeFromList(state.unvotedList, action.data)],
        });
      }
      if (findItemInList(state.votedList, action.data) > -1) {
        return state;
      }
      return Object.assign({}, state, {
        refresh: false,
        votedList: [
          ...state.votedList,
          Object.assign(action.data, { selected: true, dirty: true }),
        ],
      });
    case actionTypes.removedFromVoteList:
      if (!action.data.voted) {
        return Object.assign({}, state, {
          refresh: false,
          votedList: [...removeFromList(state.votedList, action.data)],
        });
      }
      if (findItemInList(state.unvotedList, action.data) > -1) {
        return state;
      }
      return Object.assign({}, state, {
        refresh: false,
        unvotedList: [
          ...state.unvotedList,
          Object.assign(action.data, { selected: false, dirty: true }),
        ],
      });
    case actionTypes.accountLoggedOut:
      return Object.assign({}, state, {
        votedList: [],
        unvotedList: [],
        refresh: true,
      });
    case actionTypes.votesCleared:
      return Object.assign({}, state, {
        votedList: state.votedList.filter(item => !item.pending),
        unvotedList: state.unvotedList.filter(item => !item.pending),
        refresh: true,
      });
    case actionTypes.pendingVotesAdded:
      return Object.assign({}, state, {
        votedList: state.votedList.map(item => Object.assign(item, { pending: true })),
        unvotedList: state.unvotedList.map(item => Object.assign(item, { pending: true })),
      });
    default:
      return state;
  }
};

export default voting;
