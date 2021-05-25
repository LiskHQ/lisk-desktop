import { actionTypes } from '@constants';

/**
 * voting reducer
 *
 * @param {Object} state
 * @param {Object} action
 */
const voting = (state = {}, action) => {
  switch (action.type) {
    case actionTypes.votesRetrieved: {
      if (action.data.account.votesUsed) {
        return action.data.votes
          .reduce((votesDict, delegate) => {
            votesDict[delegate.address] = {
              confirmed: Number(delegate.amount),
              unconfirmed: Number(delegate.amount),
              username: delegate.username,
            };
            return votesDict;
          }, {});
      }
      return {};
    }
    case actionTypes.voteEdited:
      return {
        ...state,
        ...action.data.reduce((mergedVotes, vote) => {
          // When added new vote using launch protocol
          let unconfirmed = '';
          // when added, removed or edited vote
          if (vote.amount !== undefined) unconfirmed = vote.amount;
          // when the launch protocol includes an existing vote
          else if (state[vote.address]) unconfirmed = state[vote.address].unconfirmed;

          mergedVotes[vote.address] = {
            confirmed: state[vote.address]
              ? state[vote.address].confirmed : 0,
            unconfirmed,
            username: state[vote.address] && state[vote.address].username
              ? state[vote.address].username : vote.username,
          };
          return mergedVotes;
        }, {}),
      };

    /**
     * This action is used when user cancels voting. It sets 'unconfirmed' state
     * of each vote to match it's 'confirmed' state.
     */
    case actionTypes.votesCleared:
      return Object.keys(state)
        .filter(address => state[address].confirmed)
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
    case actionTypes.votesConfirmed:
      return Object.keys(state)
        .filter(address => state[address].unconfirmed)
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
    case actionTypes.votesSubmitted:
      return Object.keys(state).reduce((votesDict, address) => {
        const {
          confirmed, unconfirmed, pending,
        } = state[address];
        const nextPendingStatus = pending || (confirmed !== unconfirmed);

        votesDict[address] = {
          ...state[address],
          pending: nextPendingStatus,
        };
        return votesDict;
      }, {});

    /**
     * Resets the vote dictionary after the user signs out.
     */
    case actionTypes.votesReset:
      return {};
    default:
      return state;
  }
};

export default voting;
