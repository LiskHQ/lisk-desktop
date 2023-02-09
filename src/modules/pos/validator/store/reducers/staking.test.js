import actionTypes from '../actions/actionTypes';
import staking from './staking';

describe('Reducer: staking(state, action)', () => {
  // eslint-disable-line max-statements
  const validator1 = {
    address: '100001L',
  };
  const validator2 = {
    address: '100002L',
  };
  const validator3 = {
    address: '100003L',
  };
  const cleanStakes = {
    [validator1.address]: { confirmed: 1e10, unconfirmed: 1e10, name: 'username_1' },
    [validator2.address]: { confirmed: 1e10, unconfirmed: 1e10, name: 'username_2' },
    [validator3.address]: { confirmed: 1e10, unconfirmed: 1e10, name: 'username_3' },
  };
  const dirtyStakes = {
    [validator1.address]: { ...cleanStakes[validator1.address], unconfirmed: 3e10 },
    [validator2.address]: { ...cleanStakes[validator2.address], unconfirmed: 2e10 },
    [validator3.address]: cleanStakes[[validator3.address]],
  };
  const pendingStakes = {
    [validator1.address]: { ...dirtyStakes[validator1.address], pending: true },
    [validator2.address]: { ...dirtyStakes[validator2.address], pending: true },
    [validator3.address]: { ...dirtyStakes[validator3.address], pending: false },
  };

  it('should return default state if action does not match', () => {
    const action = {
      type: '',
    };
    const changedState = staking(cleanStakes, action);

    expect(changedState).toEqual(cleanStakes);
  });

  describe('stakesRetrieved', () => {
    it('should store fetched stakes of a given account', () => {
      const action = {
        type: actionTypes.stakesRetrieved,
        data: {
          account: {
            stakesUsed: 2,
          },
          stakes: [
            { address: validator1.address, name: validator1.name, amount: 1e10 },
            { address: validator2.address, name: validator2.name, amount: 2e10 },
          ],
        },
      };
      const expectedState = {
        [validator1.address]: { confirmed: 1e10, unconfirmed: 1e10 },
        [validator2.address]: { confirmed: 2e10, unconfirmed: 2e10 },
      };
      const changedState = staking({}, action);

      expect(changedState).toEqual(expectedState);
    });
  });

  describe('stakesEdited', () => {
    it('should add validator with stake amount if does not exist among stakes', () => {
      const action = {
        type: actionTypes.stakeEdited,
        data: [
          {
            validator: validator1,
            amount: dirtyStakes[validator1.address].unconfirmed,
          },
        ],
      };
      const expectedState = {
        [validator1.address]: {
          confirmed: 0,
          unconfirmed: dirtyStakes[validator1.address].unconfirmed,
        },
      };
      const changedState = staking({}, action);

      expect(changedState).toEqual(expectedState);
    });

    it('should change stake amount if validators exist among stakes', () => {
      const action = {
        type: actionTypes.stakeEdited,
        data: [
          {
            validator: validator1,
            amount: dirtyStakes[validator1.address].unconfirmed,
          },
        ],
      };
      const expectedState = {
        [validator1.address]: {
          confirmed: cleanStakes[validator1.address].confirmed,
          unconfirmed: dirtyStakes[validator1.address].unconfirmed,
          name: 'username_1',
        },
        [validator2.address]: cleanStakes[validator2.address],
        [validator3.address]: cleanStakes[validator3.address],
      };
      const changedState = staking(cleanStakes, action);

      expect(changedState).toEqual(expectedState);
    });
  });

  describe('stakesSubmitted', () => {
    it('should add pending flag to dirty stakes', () => {
      const action = {
        type: actionTypes.stakesSubmitted,
      };
      const changedState = staking(dirtyStakes, action);

      expect(changedState).toEqual(pendingStakes);
    });
  });

  describe('stakesConfirmed', () => {
    it('should remove pending flags and update confirmed values', () => {
      const action = {
        type: actionTypes.stakesConfirmed,
      };
      const expectedState = {
        [validator1.address]: {
          ...dirtyStakes[validator1.address],
          pending: false,
          confirmed: dirtyStakes[validator1.address].unconfirmed,
        },
        [validator2.address]: {
          ...dirtyStakes[validator2.address],
          pending: false,
          confirmed: dirtyStakes[validator2.address].unconfirmed,
        },
        [validator3.address]: { ...dirtyStakes[validator3.address], pending: false },
      };
      const changedState = staking(pendingStakes, action);

      expect(changedState).toEqual(expectedState);
    });

    it('should remove unstaked validators', () => {
      const action = {
        type: actionTypes.stakesConfirmed,
      };
      const initialState = {
        [validator2.address]: { ...cleanStakes[validator2.address], pending: false },
        [validator3.address]: { ...cleanStakes[validator3.address], unconfirmed: 0, pending: true },
      };
      const expectedState = {
        [validator2.address]: { ...cleanStakes[validator2.address], pending: false },
      };
      const changedState = staking(initialState, action);

      expect(changedState).toEqual(expectedState);
    });
  });

  describe('stakesCleared', () => {
    it('should revert stakes to initial state', () => {
      const action = {
        type: actionTypes.stakesCleared,
      };
      const changedState = staking(dirtyStakes, action);

      expect(changedState).toEqual(cleanStakes);
    });
  });
});
