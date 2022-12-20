import actionTypes from '../actions/actionTypes';

/**
 * voting reducer
 *
 * @param {Object} state
 * @param {Object} action
 */
const voting = (state = {}, action) => {
  const clonedState = {...state};

  switch (action.type) {
    case actionTypes.stakesRetrieved: {
      if (action.data.account.votesUsed) {
        const voteMapInState = state;
        action.data.votes.forEach(({ delegateAddress, amount, name }) => {
          voteMapInState[delegateAddress] = {
            confirmed: +amount,
            unconfirmed: +state[delegateAddress]?.unconfirmed || +amount,
            username: name,
          };

          return voteMapInState;
        });

        return voteMapInState;
      }

      return state;
    }
    case actionTypes.stakeEdited:
      return {
        ...state,
        ...action.data.reduce((mergedVotes, vote) => {
          // When added new vote using launch protocol
          let unconfirmed = '';
          // when added, removed, or edited vote
          if (vote.amount !== undefined) unconfirmed = vote.amount;
          // when the launch protocol includes an existing vote
          else if (state[vote.address]) unconfirmed = state[vote.address].unconfirmed;

          mergedVotes[vote.address] = {
            unconfirmed,
            confirmed: state[vote.address] ? state[vote.address].confirmed : 0,
            username: state[vote.address]?.username || vote.username,
          };
          return mergedVotes;
        }, {}),
      };

    /**
     * This action is used when user cancels voting. It sets 'unconfirmed' state
     * of each vote to match it's 'confirmed' state.
     */
    case actionTypes.stakesCleared:
      return Object.keys(state)
        .filter((address) => state[address].confirmed)
        .reduce((votesDict, address) => {
          votesDict[address] = {
            confirmed: state[address].confirmed,
            unconfirmed: state[address].confirmed,
            username: state[address].username,
          };
          return votesDict;
        }, {});

    /**
     * This action is used when voting transaction is confirmed.
     * It removes the unvoted delegates, updates the confirmed vote amounts
     * and removes all pending flags
     */
    case actionTypes.stakesConfirmed:
      return Object.keys(state)
        .filter((address) => state[address].unconfirmed)
        .reduce((votesDict, address) => {
          votesDict[address] = {
            ...state[address],
            confirmed: state[address].unconfirmed,
            pending: false,
          };
          return votesDict;
        }, {});

    /**
     * This action is used when voting is submitted. It sets 'pending' status
     * of all votes that have different 'confirmed' and 'unconfirmed' state
     */
    case actionTypes.stakesSubmitted:
      return Object.keys(state).reduce((votesDict, address) => {
        const { confirmed, unconfirmed, pending } = state[address];
        const nextPendingStatus = pending || confirmed !== unconfirmed;

        votesDict[address] = {
          ...state[address],
          pending: nextPendingStatus,
        };
        return votesDict;
      }, {});

    /**
     * This action is used to discard a vote from the staking queue
     */
    case actionTypes.stakeDiscarded:
      delete clonedState[action.data.address]
      return clonedState
    /**
     * Resets the vote dictionary after the user signs out.
     */
    case actionTypes.stakesReset:
      return {};
    default:
      return state;
  }
};

export default voting;
