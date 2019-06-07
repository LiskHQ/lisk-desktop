// TODO rename this file to 'delegates.js'
import actionTypes from '../../constants/actions';

const mergeVotes = (newList, oldDict) => {
  const newDict = newList.reduce((tempDict, delegate) => {
    tempDict[delegate.username] = {
      confirmed: true,
      unconfirmed: true,
      pending: false,
      publicKey: delegate.publicKey,
      rank: delegate.rank,
      address: delegate.address,
      productivity: delegate.productivity,
    };
    return tempDict;
  }, {});

  Object.keys(oldDict).forEach((username) => { // eslint-disable-line complexity
    // By pendingVotesAdded, we set confirmed equal to unconfirmed,
    // to recognize pending-not-voted items from pending-voted
    // so here we just check unconfirmed flag.
    const { confirmed, unconfirmed, pending } = oldDict[username];
    if (// we've voted but it's not in the new list
      (pending && unconfirmed && newDict[username] === undefined) ||
      // we've un-voted but it still exists in the new list
      (pending && !unconfirmed && newDict[username] !== undefined) ||
      // dirty, not voted for and not updated in other client
      (!pending && unconfirmed !== confirmed &&
        (newDict[username] === undefined || confirmed === newDict[username].confirmed))
    ) {
      newDict[username] = { ...oldDict[username] };
    }
  });

  return newDict;
};

/**
 * voting reducer
 *
 * @param {Object} state
 * @param {Object} action
 */
const voting = (state = { // eslint-disable-line complexity
  votes: {},
  delegates: [],
  voteLookupStatus: {},
}, action) => {
  switch (action.type) {
    case actionTypes.votesAdded:
      return {
        ...state,
        votes: action.data.list
          .reduce((votesDict, delegate) => {
            votesDict[delegate.username] = {
              confirmed: true,
              unconfirmed: true,
              publicKey: delegate.publicKey,
              productivity: delegate.productivity,
              rank: delegate.rank,
              address: delegate.address,
            };
            return votesDict;
          }, {}),
        refresh: false, // TODO figure out why we need this and try to remove it
      };

    case actionTypes.delegatesAdded:
      return {
        ...state,
        delegates: action.data.refresh ? action.data.list :
          [...state.delegates, ...action.data.list],
        refresh: true,
      };

    case actionTypes.voteToggled:
      return {
        ...state,
        refresh: false,
        votes: {
          ...state.votes,
          [action.data.username]: {
            confirmed: state.votes[action.data.username] ?
              state.votes[action.data.username].confirmed : false,
            unconfirmed: state.votes[action.data.username] ?
              !state.votes[action.data.username].unconfirmed : true,
            publicKey: action.data.publicKey,
            productivity: action.data.productivity,
            rank: action.data.rank,
            address: action.data.address,
          },
        },
      };

    // TODO change this to actionTypes.clearDelegates and dispatch that one from a middleware
    case actionTypes.accountLoading:
      return {
        ...state,
        votes: {},
        delegates: [],
        refresh: true,
      };

    case actionTypes.votesCleared:
      return {
        ...state,
        votes: Object.keys(state.votes).reduce((votesDict, username) => {
          votesDict[username] = {
            confirmed: state.votes[username].confirmed,
            unconfirmed: state.votes[username].confirmed,
            publicKey: state.votes[username].publicKey,
            address: state.votes[username].address,
            productivity: state.votes[username].productivity,
            rank: state.votes[username].rank,
            pending: false,
          };
          return votesDict;
        }, {}),
        refresh: true,
      };

    // TODO try to merge this with actionTypes.votesAdded
    case actionTypes.votesUpdated:
      return {
        ...state,
        votes: mergeVotes(action.data.list, state.votes),
        refresh: false,
      };

    /*
     * This action is used when voting is submitted. It sets 'pending' status
     * of all votes that have different confirmed and unconfirmed state
     */
    case actionTypes.pendingVotesAdded:
      return {
        ...state,
        refresh: false,
        votes: Object.keys(state.votes).reduce((votesDict, username) => {
          const {
            confirmed, unconfirmed, pending,
          } = state.votes[username];
          const nextPendingStatus = pending || (confirmed !== unconfirmed);

          votesDict[username] = {
            ...state.votes[username],
            confirmed: nextPendingStatus ? !confirmed : confirmed,
            pending: nextPendingStatus,
          };
          return votesDict;
        }, {}),
      };

    case actionTypes.voteLookupStatusUpdated:
      return {
        ...state,
        voteLookupStatus: {
          ...state.voteLookupStatus,
          [action.data.username]: action.data.status,
        },
      };

    case actionTypes.voteLookupStatusCleared:
      return {
        ...state,
        voteLookupStatus: { },
      };

    default:
      return state;
  }
};

export default voting;
