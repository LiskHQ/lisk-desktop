import actionTypes from '../../constants/actions';
import voting from './voting';

describe('Reducer: voting(state, action)', () => { // eslint-disable-line max-statements
  const delegate1 = {
    publicKey: 'sample_key_1', address: '100001L', rank: 1, productivity: 99, username: 'username1',
  };
  const delegate2 = {
    publicKey: 'sample_key_2', address: '100002L', rank: 2, productivity: 98, username: 'username2',
  };
  const delegate3 = {
    publicKey: 'sample_key_3', address: '100003L', rank: 3, productivity: 97, username: 'username3',
  };
  const cleanVotes = {
    username1: { confirmed: 0, unconfirmed: 0, ...delegate1 },
    username2: { confirmed: 1e10, unconfirmed: 1e10, ...delegate2 },
    username3: { confirmed: 1e10, unconfirmed: 1e10, ...delegate3 },
  };
  const dirtyVotes = {
    username1: { ...cleanVotes.username1, unconfirmed: 1e10 },
    username2: { ...cleanVotes.username2, unconfirmed: 2e10 },
    username3: cleanVotes.username3,
  };
  const pendingVotes = {
    username1: { ...dirtyVotes.username1, pending: true },
    username2: { ...dirtyVotes.username2, pending: true },
    username3: { ...dirtyVotes.username3, pending: false },
  };

  it('should return default state if action does not match', () => {
    const action = {
      type: '',
    };
    const changedState = voting(cleanVotes, action);

    expect(changedState).toEqual(cleanVotes);
  });

  describe('votesRetrieved', () => {
    it('should store fetched votes of a given account', () => {
      const action = {
        type: actionTypes.votesRetrieved,
        data: [
          { ...delegate1, voteAmount: 1e10 },
          { ...delegate2, voteAmount: 2e10 },
        ],
      };
      const expectedState = {
        username1: { ...delegate1, confirmed: 1e10, unconfirmed: 1e10 },
        username2: { ...delegate2, confirmed: 2e10, unconfirmed: 2e10 },
      };
      delete expectedState.username1.username;
      delete expectedState.username2.username;
      const changedState = voting({}, action);

      expect(changedState).toEqual(expectedState);
    });
  });

  describe('votesEdited', () => {
    it('should add delegate with voteAmount if does not exist among votes', () => {
      const action = {
        type: actionTypes.votesEdited,
        data: {
          delegate: delegate1,
          voteAmount: dirtyVotes.username1.unconfirmed,
        },
      };
      const expectedState = {
        username1: {
          ...delegate1,
          confirmed: cleanVotes.username1.confirmed,
          unconfirmed: dirtyVotes.username1.unconfirmed,
        },
      };
      delete expectedState.username1.username;
      const changedState = voting({}, action);

      expect(changedState).toEqual(expectedState);
    });

    it('should change voteAmount if delegates exist among votes', () => {
      const action = {
        type: actionTypes.votesEdited,
        data: {
          delegate: delegate1,
          voteAmount: dirtyVotes.username1.unconfirmed,
        },
      };
      const expectedState = {
        username1: {
          ...delegate1,
          confirmed: cleanVotes.username1.confirmed,
          unconfirmed: dirtyVotes.username1.unconfirmed,
        },
        username2: cleanVotes.username2,
        username3: cleanVotes.username3,
      };
      delete expectedState.username1.username;
      const changedState = voting(cleanVotes, action);

      expect(changedState).toEqual(expectedState);
    });
  });

  describe('votesSubmitted', () => {
    it('should add pending flag to dirty votes', () => {
      const action = {
        type: actionTypes.votesSubmitted,
      };
      const changedState = voting(dirtyVotes, action);

      expect(changedState).toEqual(pendingVotes);
    });
  });

  describe('votesUpdated', () => {
    it('should remove pending flags and update confirmed values', () => {
      const action = {
        type: actionTypes.votesUpdated,
      };
      const expectedState = {
        username1: {
          ...dirtyVotes.username1, pending: false, confirmed: dirtyVotes.username1.unconfirmed,
        },
        username2: {
          ...dirtyVotes.username2, pending: false, confirmed: dirtyVotes.username2.unconfirmed,
        },
        username3: { ...dirtyVotes.username3, pending: false },
      };
      const changedState = voting(pendingVotes, action);

      expect(changedState).toEqual(expectedState);
    });

    it('should remove unvoted delegates', () => {
      const action = {
        type: actionTypes.votesUpdated,
      };
      const initialState = {
        username2: { ...cleanVotes.username2, pending: false },
        username3: { ...cleanVotes.username3, unconfirmed: 0, pending: true },
      };
      const expectedState = {
        username2: { ...cleanVotes.username2, pending: false },
      };
      const changedState = voting(initialState, action);

      expect(changedState).toEqual(expectedState);
    });
  });

  describe('votesCleared', () => {
    it('should revert votes to initial state', () => {
      const action = {
        type: actionTypes.votesCleared,
      };
      const expectedState = {
        username1: { ...cleanVotes.username1, pending: false },
        username2: { ...cleanVotes.username2, pending: false },
        username3: { ...dirtyVotes.username3, pending: false },
      };
      const changedState = voting(pendingVotes, action);

      expect(changedState).toEqual(expectedState);
    });
  });
});
