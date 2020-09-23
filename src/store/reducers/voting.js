import actionTypes from '../../constants/actions';

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
          votesDict[delegate.address] = {
            confirmed: delegate.amount,
            unconfirmed: delegate.amount,
          };
          return votesDict;
        }, {});

    case actionTypes.voteEdited:
      return {
        ...state,
        ...action.data.reduce((mergedVotes, vote) => {
          mergedVotes[vote.address] = {
            confirmed: state[vote.address]
              ? state[vote.address].confirmed : 0,
            unconfirmed: vote.amount || (state[vote.address] && state[vote.address].unconfirmed),
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
    default:
      return state;
  }
};

export default voting;
