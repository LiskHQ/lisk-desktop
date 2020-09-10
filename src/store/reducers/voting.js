import actionTypes from '../../constants/actions';

const mergeVotes = (newList, oldDict) => {
  const newDict = newList.reduce((tempDict, delegate) => {
    tempDict[delegate.username] = {
      confirmed: 0,
      unconfirmed: 0,
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
const voting = (state = {}, action) => {
  switch (action.type) {
    case actionTypes.votesRetrieved:
      return action.data
        .reduce((votesDict, delegate) => {
          votesDict[delegate.username] = {
            confirmed: delegate.voteAmount,
            unconfirmed: delegate.voteAmount,
            publicKey: delegate.publicKey,
            productivity: delegate.productivity,
            rank: delegate.rank,
            address: delegate.address,
          };
          return votesDict;
        }, {});

    case actionTypes.voteEdited:
      return {
        ...state,
        [action.data.delegate.username]: {
          confirmed: state[action.data.delegate.username]
            ? state[action.data.delegate.username].confirmed : 0,
          unconfirmed: action.data.voteAmount,
          publicKey: action.data.delegate.publicKey,
          productivity: action.data.delegate.productivity,
          rank: action.data.delegate.rank,
          address: action.data.delegate.address,
        },
      };

    /**
     * This action is used when user cancels voting. It sets 'unconfirmed' state
     * of each vote to match it's 'confirmed' state.
     */
    case actionTypes.votesCleared:
      return Object.keys(state).reduce((votesDict, username) => {
        votesDict[username] = {
          ...state[username],
          unconfirmed: state[username].confirmed,
          pending: false,
        };
        return votesDict;
      }, {});

    /**
     * This action is used when voting transaction is confirmed.
     * It removes the unvoted delegates, updates the confirmed vote amounts
     * and removes all pending flags
     */
    case actionTypes.votesUpdated:
      return Object.keys(state)
        .filter(username => state[username].unconfirmed)
        .reduce((votesDict, username) => {
          votesDict[username] = {
            ...state[username],
            confirmed: state[username].unconfirmed,
            pending: false,
          };
          return votesDict;
        }, {});

    /**
     * This action is used when voting is submitted. It sets 'pending' status
     * of all votes that have different 'confirmed' and 'unconfirmed' state
     */
    case actionTypes.votesSubmitted:
      return Object.keys(state).reduce((votesDict, username) => {
        const {
          confirmed, unconfirmed, pending,
        } = state[username];
        const nextPendingStatus = pending || (confirmed !== unconfirmed);

        votesDict[username] = {
          ...state[username],
          pending: nextPendingStatus,
        };
        return votesDict;
      }, {});
    default:
      return state;
  }
};

export default voting;
