import actionTypes from '../actions/actionTypes';

const staking = (state = {}, action) => {
  const clonedState = { ...state };

  switch (action.type) {
    case actionTypes.stakesRetrieved: {
      if (action.data.stakes) {
        const stakes = Object.assign(state, {});
        action.data.stakes.forEach(({ address, amount, name, commission }) => {
          const stakeDifference = Math.abs(
            +(state[address]?.unconfirmed ?? 0) - +(state[address]?.confirmed ?? 0)
          );
          stakes[address] = {
            commission: commission || state[address]?.commission,
            confirmed: +amount,
            unconfirmed: stakeDifference !== 0 ? state[address]?.unconfirmed ?? 0 : +amount,
            name,
          };

          return stakes;
        });

        return stakes;
      }

      return state;
    }
    case actionTypes.stakeEdited:
      return {
        ...state,
        ...action.data.reduce((mergedStakes, { amount, validator }) => {
          // When added new stake using launch protocol
          let unconfirmed = '';
          // when added, removed, or edited stake
          if (amount !== undefined) unconfirmed = amount;
          // when the launch protocol includes an existing stake
          else if (state[validator.address]) unconfirmed = state[validator.address].unconfirmed;

          mergedStakes[validator.address] = {
            unconfirmed: +unconfirmed,
            confirmed: state[validator.address] ? +state[validator.address].confirmed : 0,
            name: state[validator.address]?.name || validator.name,
            commission:
              state[validator.address]?.commission || action.data[0]?.validator?.commission,
          };
          return mergedStakes;
        }, {}),
      };

    /**
     * This action is used when user cancels staking. It sets 'unconfirmed' state
     * of each stake to match it's 'confirmed' state.
     */
    case actionTypes.stakesCleared:
      return Object.keys(state)
        .filter((address) => state[address].confirmed)
        .reduce((stakes, address) => {
          stakes[address] = {
            confirmed: state[address].confirmed,
            unconfirmed: state[address].confirmed,
            name: state[address].name,
            commission: state[address].commission,
          };
          return stakes;
        }, {});

    /**
     * This action is used when staking transaction is confirmed.
     * It removes the unstaked validator, updates the confirmed stake amounts
     * and removes all pending flags
     */
    case actionTypes.stakesConfirmed:
      return Object.keys(state)
        .filter((address) => state[address].unconfirmed)
        .reduce((stakes, address) => {
          stakes[address] = {
            ...state[address],
            confirmed: state[address].unconfirmed,
            pending: false,
          };
          return stakes;
        }, {});

    /**
     * This action is used when staking is submitted. It sets 'pending' status
     * of all stakes that have different 'confirmed' and 'unconfirmed' state
     */
    case actionTypes.stakesSubmitted:
      return Object.keys(state).reduce((stakes, address) => {
        const { confirmed, unconfirmed, pending } = state[address];
        const nextPendingStatus = pending || confirmed !== unconfirmed;

        stakes[address] = {
          ...state[address],
          pending: nextPendingStatus,
        };
        return stakes;
      }, {});

    /**
     * This action is used to discard a stake from the staking queue
     */
    case actionTypes.stakeDiscarded:
      delete clonedState[action.data.address];
      return clonedState;
    /**
     * Resets the stake dictionary after the user signs out.
     */
    case actionTypes.stakesReset:
      return {};
    default:
      return state;
  }
};

export default staking;
