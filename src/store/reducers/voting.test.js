import { expect } from 'chai';
import actionTypes from '../../constants/actions';
import voting from './voting';

describe('Reducer: voting(state, action)', () => {
  const state = {
    votes: {
      username1: { confirmed: true, unconfirmed: true },
      username2: { confirmed: false, unconfirmed: false },
    },
  };
  it('should return default state if action does not match', () => {
    const action = {
      type: '',
    };
    const changedState = voting(state, action);

    expect(changedState).to.be.equal(state);
  });

  it('should clean up with action: accountLoggedOut', () => {
    const action = {
      type: actionTypes.accountLoggedOut,
    };
    const changedState = voting(state, action);
    const expectedState = { votes: {}, delegates: [], refresh: true };

    expect(changedState).to.be.deep.equal(expectedState);
  });

  it('should fill delegates list with action: votesAdded', () => {
    const action = {
      type: actionTypes.votesAdded,
      data: {
        list: [
          { username: 'username1', id: '123HGJ123234L' },
        ],
      },
    };
    const expectedState = {
      votes: {
        username1: { confirmed: true, unconfirmed: true },
      },
      delegates: [{ username: 'username1', id: '123HGJ123234L' }],
    };
    const oldState = { votes: {}, delegates: [] };
    const changedState = voting(oldState, action);

    expect(changedState).to.be.deep.equal(expectedState);
  });

  it('should fill delegates list with action: delegatesAdded', () => {
    const action = {
      type: actionTypes.delegatesAdded,
      data: {
        list: [
          { username: 'username1', id: '123HGJ123234L' },
        ],
      },
    };
    const oldState = {
      delegates: [{ username: 'username2', id: '123HGJ123235L' }],
    };
    const expectedState = {
      delegates: [
        { username: 'username2', id: '123HGJ123235L' },
        { username: 'username1', id: '123HGJ123234L' },
      ],
    };
    const changedState = voting(oldState, action);

    expect(changedState).to.be.deep.equal(expectedState);
  });

  it('should toggle unconfirmed state, with action: voteToggled', () => {
    const action = {
      type: actionTypes.voteToggled,
      data: 'username1',
    };
    const expectedState = {
      votes: {
        username1: { confirmed: true, unconfirmed: false },
        username2: { confirmed: false, unconfirmed: false },
      },
    };
    const changedState = voting(state, action);

    expect(changedState).to.be.deep.equal(expectedState);
  });

  it('should add to votes dictionary in not exist, with action: voteToggled', () => {
    const action = {
      type: actionTypes.voteToggled,
      data: 'username3',
    };
    const expectedState = {
      votes: {
        username1: { confirmed: true, unconfirmed: true },
        username2: { confirmed: false, unconfirmed: false },
        username3: { confirmed: false, unconfirmed: true },
      },
    };
    const changedState = voting(state, action);

    expect(changedState).to.be.deep.equal(expectedState);
  });

  it('should mark the toggles votes as pending, with action: pendingVotesAdded ', () => {
    const action = {
      type: actionTypes.pendingVotesAdded,
    };
    const oldState = {
      votes: {
        username1: { confirmed: true, unconfirmed: false },
        username2: { confirmed: false, unconfirmed: true },
        username3: { confirmed: true, unconfirmed: true },
        username4: { confirmed: false, unconfirmed: false },
      },
    };
    const expectedState = {
      votes: {
        username1: { confirmed: false, unconfirmed: false, pending: true },
        username2: { confirmed: true, unconfirmed: true, pending: true },
        username3: { confirmed: true, unconfirmed: true, pending: false },
        username4: { confirmed: false, unconfirmed: false, pending: false },
      },
    };
    const changedState = voting(oldState, action);

    expect(changedState).to.be.deep.equal(expectedState);
  });

  it('should remove all pending flags from votes, with action: votesCleared', () => {
    const action = {
      type: actionTypes.votesCleared,
    };
    const oldState = {
      votes: {
        username1: { confirmed: true, unconfirmed: false },
        username2: { confirmed: false, unconfirmed: true },
        username3: { confirmed: true, unconfirmed: true },
        username4: { confirmed: false, unconfirmed: false },
      },
    };
    const expectedState = {
      votes: {
        username1: { confirmed: true, unconfirmed: true, pending: false },
        username2: { confirmed: false, unconfirmed: false, pending: false },
        username3: { confirmed: true, unconfirmed: true, pending: false },
        username4: { confirmed: false, unconfirmed: false, pending: false },
      },
      refresh: true,
    };
    const changedState = voting(oldState, action);

    expect(changedState).to.be.deep.equal(expectedState);
  });
});
