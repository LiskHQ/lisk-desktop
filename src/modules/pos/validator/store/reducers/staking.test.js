import actionTypes from '../actions/actionTypes';
import voting from './staking';

describe('Reducer: voting(state, action)', () => { // eslint-disable-line max-statements
  const delegate1 = {
    address: '100001L',
  };
  const delegate2 = {
    address: '100002L',
  };
  const delegate3 = {
    address: '100003L',
  };
  const cleanVotes = {
    [delegate1.address]: { confirmed: 1e10, unconfirmed: 1e10, username: 'username_1' },
    [delegate2.address]: { confirmed: 1e10, unconfirmed: 1e10, username: 'username_2' },
    [delegate3.address]: { confirmed: 1e10, unconfirmed: 1e10, username: 'username_3' },
  };
  const dirtyVotes = {
    [delegate1.address]: { ...cleanVotes[delegate1.address], unconfirmed: 3e10 },
    [delegate2.address]: { ...cleanVotes[delegate2.address], unconfirmed: 2e10 },
    [delegate3.address]: cleanVotes[[delegate3.address]],
  };
  const pendingVotes = {
    [delegate1.address]: { ...dirtyVotes[delegate1.address], pending: true },
    [delegate2.address]: { ...dirtyVotes[delegate2.address], pending: true },
    [delegate3.address]: { ...dirtyVotes[delegate3.address], pending: false },
  };

  it('should return default state if action does not match', () => {
    const action = {
      type: '',
    };
    const changedState = voting(cleanVotes, action);

    expect(changedState).toEqual(cleanVotes);
  });

  describe('stakesRetrieved', () => {
    it('should store fetched votes of a given account', () => {
      const action = {
        type: actionTypes.stakesRetrieved,
        data: {
          account: {
            votesUsed: 2,
          },
          votes: [
            { delegateAddress: delegate1.address, username: delegate1.username, amount: 1e10 },
            { delegateAddress: delegate2.address, username: delegate2.username, amount: 2e10 },
          ],
        },
      };
      const expectedState = {
        [delegate1.address]: { confirmed: 1e10, unconfirmed: 1e10 },
        [delegate2.address]: { confirmed: 2e10, unconfirmed: 2e10 },
      };
      const changedState = voting({}, action);

      expect(changedState).toEqual(expectedState);
    });
  });

  describe('votesEdited', () => {
    it('should add validator with voteAmount if does not exist among votes', () => {
      const action = {
        type: actionTypes.stakeEdited,
        data: [{
          ...delegate1,
          amount: dirtyVotes[delegate1.address].unconfirmed,
        }],
      };
      const expectedState = {
        [delegate1.address]: {
          confirmed: 0,
          unconfirmed: dirtyVotes[delegate1.address].unconfirmed,
        },
      };
      const changedState = voting({}, action);

      expect(changedState).toEqual(expectedState);
    });

    it('should change voteAmount if validators exist among votes', () => {
      const action = {
        type: actionTypes.stakeEdited,
        data: [{
          ...delegate1,
          amount: dirtyVotes[delegate1.address].unconfirmed,
        }],
      };
      const expectedState = {
        [delegate1.address]: {
          confirmed: cleanVotes[delegate1.address].confirmed,
          unconfirmed: dirtyVotes[delegate1.address].unconfirmed,
          username: 'username_1',
        },
        [delegate2.address]: cleanVotes[delegate2.address],
        [delegate3.address]: cleanVotes[delegate3.address],
      };
      const changedState = voting(cleanVotes, action);

      expect(changedState).toEqual(expectedState);
    });
  });

  describe('stakesSubmitted', () => {
    it('should add pending flag to dirty votes', () => {
      const action = {
        type: actionTypes.stakesSubmitted,
      };
      const changedState = voting(dirtyVotes, action);

      expect(changedState).toEqual(pendingVotes);
    });
  });

  describe('stakesConfirmed', () => {
    it('should remove pending flags and update confirmed values', () => {
      const action = {
        type: actionTypes.stakesConfirmed,
      };
      const expectedState = {
        [delegate1.address]: {
          ...dirtyVotes[delegate1.address],
          pending: false,
          confirmed: dirtyVotes[delegate1.address].unconfirmed,
        },
        [delegate2.address]: {
          ...dirtyVotes[delegate2.address],
          pending: false,
          confirmed: dirtyVotes[delegate2.address].unconfirmed,
        },
        [delegate3.address]: { ...dirtyVotes[delegate3.address], pending: false },
      };
      const changedState = voting(pendingVotes, action);

      expect(changedState).toEqual(expectedState);
    });

    it('should remove unvoted validators', () => {
      const action = {
        type: actionTypes.stakesConfirmed,
      };
      const initialState = {
        [delegate2.address]: { ...cleanVotes[delegate2.address], pending: false },
        [delegate3.address]: { ...cleanVotes[delegate3.address], unconfirmed: 0, pending: true },
      };
      const expectedState = {
        [delegate2.address]: { ...cleanVotes[delegate2.address], pending: false },
      };
      const changedState = voting(initialState, action);

      expect(changedState).toEqual(expectedState);
    });
  });

  describe('stakesCleared', () => {
    it('should revert votes to initial state', () => {
      const action = {
        type: actionTypes.stakesCleared,
      };
      const changedState = voting(dirtyVotes, action);

      expect(changedState).toEqual(cleanVotes);
    });
  });
});
