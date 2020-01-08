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
      (pending && unconfirmed && newDict[username] === undefined)
      // we've un-voted but it still exists in the new list
      || (pending && !unconfirmed && newDict[username] !== undefined)
      // dirty, not voted for and not updated in other client
      || (!pending && unconfirmed !== confirmed
        && (newDict[username] === undefined || confirmed === newDict[username].confirmed))
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
      };

    case actionTypes.delegatesAdded:
      return {
        ...state,
        delegates: action.data.refresh ? action.data.list
          : [...state.delegates, ...action.data.list],
      };

    case actionTypes.voteToggled:
      return {
        ...state,
        votes: {
          ...state.votes,
          [action.data.username]: {
            confirmed: state.votes[action.data.username]
              ? state.votes[action.data.username].confirmed : false,
            unconfirmed: state.votes[action.data.username]
              ? !state.votes[action.data.username].unconfirmed : true,
            publicKey: action.data.account.publicKey,
            productivity: action.data.productivity,
            rank: action.data.rank,
            address: action.data.account.address,
          },
        },
      };

    /**
     * This action is used when user cancels voting. It sets 'unconfirmed' state
     * of each vote to match it's 'confirmed' state.
     */
    case actionTypes.votesCleared:
      return {
        ...state,
        votes: Object.keys(state.votes).reduce((votesDict, username) => {
          votesDict[username] = {
            ...state.votes[username],
            unconfirmed: state.votes[username].confirmed,
            pending: false,
          };
          return votesDict;
        }, {}),
      };

    /**
     * This action is used when voting transaction is confirmed. It updates votes
     * based on response from votes API endpoint.
     * https://lisk.io/documentation/lisk-core/api#/Votes
     */
    case actionTypes.votesUpdated:
      return {
        ...state,
        votes: mergeVotes(action.data.list, state.votes),
      };

    /**
     * This action is used when voting is submitted. It sets 'pending' status
     * of all votes that have different 'confirmed' and 'unconfirmed' state
     */
    case actionTypes.pendingVotesAdded:
      return {
        ...state,
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
    default:
      return state;
  }
};

export default voting;
