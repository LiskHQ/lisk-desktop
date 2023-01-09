import actionTypes from '../actions/actionTypes';

/**
 * staking reducer
 *
 * @param {Object} state
 * @param {Object} action
 */
const staking = (state = {}, action) => {
  const clonedState = { ...state };

  switch (action.type) {
    case actionTypes.stakesRetrieved: {
      if (action.data.stakes) {
        const stakesMapInState = state;
        action.data.stakes.forEach(({ address, amount, name }) => {
          stakesMapInState[address] = {
            confirmed: +amount,
            unconfirmed: +state[address]?.unconfirmed || +amount,
            username: name,
          };

          return stakesMapInState;
        });

        return stakesMapInState;
      }

      return state;
    }
    case actionTypes.stakeEdited:
      return {
        ...state,
        ...action.data.reduce((mergedStakes, stake) => {
          // When added new stake using launch protocol
          let unconfirmed = '';
          // when added, removed, or edited stake
          if (stake.amount !== undefined) unconfirmed = stake.amount;
          // when the launch protocol includes an existing stake
          else if (state[stake.address]) unconfirmed = state[stake.address].unconfirmed;

          mergedStakes[stake.address] = {
            unconfirmed,
            confirmed: state[stake.address] ? state[stake.address].confirmed : 0,
            username: state[stake.address]?.username || stake.username,
          };
          return mergedStakes;
        }, {}),
      };

    /**
     * This action is used when user cancels staking. It sets 'unconfirmed' state
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
     * This action is used when staking transaction is confirmed.
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
     * This action is used when staking is submitted. It sets 'pending' status
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

export default staking;
