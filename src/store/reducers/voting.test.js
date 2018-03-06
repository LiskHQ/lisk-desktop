import { expect } from 'chai';
import actionTypes from '../../constants/actions';
import voting from './voting';

describe('Reducer: voting(state, action)', () => {
  const initialState = { votes: {}, delegates: [], refresh: true };
  const defaultVoteUserData = {
    confirmed: true,
    unconfirmed: true,
    pending: false,
    publicKey: 'sample_key',
  };
  const cleanVotes = {
    username1: { confirmed: false, unconfirmed: false, publicKey: 'sample_key' },
    username2: { confirmed: true, unconfirmed: true, publicKey: 'sample_key' },
    username3: { confirmed: false, unconfirmed: false, publicKey: 'sample_key' },
  };
  const dirtyVotes = {
    username1: { confirmed: false, unconfirmed: true, publicKey: 'sample_key' },
    username2: { confirmed: true, unconfirmed: true, publicKey: 'sample_key' },
    username3: { confirmed: false, unconfirmed: false, publicKey: 'sample_key' },
  };
  const pendingVotes = {
    username1: { confirmed: true, unconfirmed: true, pending: true, publicKey: 'sample_key' },
    username2: { confirmed: true, unconfirmed: true, pending: false, publicKey: 'sample_key' },
    username3: { confirmed: false, unconfirmed: false, pending: false, publicKey: 'sample_key' },
  };

  const restoredVotes = {
    username1: { confirmed: false, unconfirmed: false, pending: false, publicKey: 'sample_key' },
    username2: { confirmed: true, unconfirmed: true, pending: false, publicKey: 'sample_key' },
    username3: { confirmed: false, unconfirmed: false, pending: false, publicKey: 'sample_key' },
  };
  const delegates1 = [
    { username: 'username1', publicKey: 'sample_key' },
    { username: 'username2', publicKey: 'sample_key' },
  ];
  const delegates2 = [
    { username: 'username3', publicKey: 'sample_key' },
    { username: 'username4', publicKey: 'sample_key' },
  ];
  const fullDelegates = [...delegates1, ...delegates2];

  it('should return default state if action does not match', () => {
    const action = {
      type: '',
    };
    const state = { votes: cleanVotes };
    const changedState = voting(state, action);

    expect(changedState).to.be.equal(state);
  });

  it('should clean up with action: accountLoading', () => {
    const action = {
      type: actionTypes.accountLoading,
    };
    const state = { votes: cleanVotes, delegates: fullDelegates, refresh: false };
    const changedState = voting(state, action);

    expect(changedState).to.be.deep.equal(initialState);
  });

  it('should fill votes object with action: votesAdded', () => {
    const action = {
      type: actionTypes.votesAdded,
      data: {
        list: delegates1,
      },
    };
    const expectedState = {
      votes: {
        username1: { confirmed: true, unconfirmed: true, publicKey: 'sample_key' },
        username2: { confirmed: true, unconfirmed: true, publicKey: 'sample_key' },
      },
      delegates: [],
      refresh: false,
    };
    const changedState = voting(initialState, action);

    expect(changedState).to.be.deep.equal(expectedState);
  });

  it('should append to delegates list with action: delegatesAdded, refresh: false', () => {
    const action = {
      type: actionTypes.delegatesAdded,
      data: {
        list: delegates2,
        totalCount: 100,
        refresh: false,
      },
    };
    const state = {
      delegates: delegates1,
    };
    const expectedState = {
      delegates: fullDelegates,
      refresh: true,
      totalDelegates: 100,
    };
    const changedState = voting(state, action);

    expect(changedState.delegates).to.be.deep.equal(expectedState.delegates);
  });

  it('should replace delegates with the new delegates list with action: delegatesAdded, refresh: true', () => {
    const action = {
      type: actionTypes.delegatesAdded,
      data: {
        list: delegates1,
        totalDelegates: 100,
        refresh: true,
      },
    };
    const state = {
      delegates: delegates2,
    };
    const expectedState = {
      delegates: delegates1,
      refresh: true,
      totalDelegates: 100,
    };
    const changedState = voting(state, action);

    expect(changedState).to.be.deep.equal(expectedState);
  });

  it('should toggle unconfirmed state, with action: voteToggled', () => {
    const action = {
      type: actionTypes.voteToggled,
      data: delegates1[0],
    };
    const state = { votes: cleanVotes };
    const expectedState = {
      votes: dirtyVotes,
      refresh: false,
    };
    const changedState = voting(state, action);

    expect(changedState).to.be.deep.equal(expectedState);
  });

  it('should add to votes dictionary in not exist, with action: voteToggled', () => {
    const action = {
      type: actionTypes.voteToggled,
      data: delegates1[0],
    };
    const expectedState = {
      votes: {
        [delegates1[0].username]: dirtyVotes[delegates1[0].username],
      },
      delegates: [],
      refresh: false,
    };
    const changedState = voting(initialState, action);

    expect(changedState).to.be.deep.equal(expectedState);
  });

  it('should mark the toggles votes as pending, with action: pendingVotesAdded ', () => {
    const action = {
      type: actionTypes.pendingVotesAdded,
    };
    const state = {
      votes: dirtyVotes,
    };
    const expectedState = {
      votes: pendingVotes,
      refresh: false,
    };
    const changedState = voting(state, action);
    expect(changedState).to.be.deep.equal(expectedState);
  });

  it('should remove all pending flags from votes, with action: votesCleared', () => {
    const action = {
      type: actionTypes.votesCleared,
    };
    const state = {
      votes: dirtyVotes,
    };

    const expectedState = {
      votes: restoredVotes,
      refresh: true,
    };
    const changedState = voting(state, action);

    expect(changedState).to.be.deep.equal(expectedState);
  });

  it('should update new username in votes when we\'ve voted but it\'s not in the new list', () => {
    const action = {
      type: actionTypes.votesUpdated,
      data: {
        list: [{ username: 'username5', publicKey: 'sample_key' }],
      },
    };
    const votedButNotYetInList = {
      username1: { confirmed: true, unconfirmed: true, pending: true, publicKey: 'sample_key' },
    };
    const state = {
      votes: { ...votedButNotYetInList },
    };
    const newUserNameRegisteredInVotes = {
      votes: {
        ...votedButNotYetInList,
        username5: { ...defaultVoteUserData },
      },
      refresh: false,
    };
    const saveNewUserInVotes = voting(state, action);
    expect(saveNewUserInVotes).to.be.deep.equal(newUserNameRegisteredInVotes);
  });

  it('should not change votes, when we\'ve un-voted but user still exists in the new list', () => {
    const updateVotesWithExistingUsernameAction = {
      type: actionTypes.votesUpdated,
      data: {
        list: [{ username: 'username1', publicKey: 'sample_key' }],
      },
    };
    const updateVotesUnvotedWithExistingUsername = {
      username1: { confirmed: true, unconfirmed: false, pending: true, publicKey: 'sample_key' },
    };
    const state = {
      votes: { ...updateVotesUnvotedWithExistingUsername },
    };
    const notChangedVotesRecords = {
      votes: { ...updateVotesUnvotedWithExistingUsername },
      refresh: false,
    };

    const changedState = voting(state, updateVotesWithExistingUsernameAction);
    expect(changedState).to.be.deep.equal(notChangedVotesRecords);
  });

  it('should add new record of username in votes, when dirty and not voted for and username not yet in the new list', () => {
    const action = {
      type: actionTypes.votesUpdated,
      data: {
        list: [{ username: 'username5', publicKey: 'sample_key' }],
      },
    };
    const updateVotesDirtyNotVotedNotExistingUsername = {
      username1: { confirmed: true, unconfirmed: false, pending: false, publicKey: 'sample_key' },
    };
    const state = {
      votes: { ...updateVotesDirtyNotVotedNotExistingUsername },
    };
    const newUsernameAddedToVotes = {
      votes: {
        ...updateVotesDirtyNotVotedNotExistingUsername,
        username5: { ...defaultVoteUserData },
      },
      refresh: false,
    };
    const changedState = voting(state, action);
    expect(changedState).to.be.deep.equal(newUsernameAddedToVotes);
  });

  it('should keep record of username in votes, when dirty and not voted for and username is already in the new list', () => {
    const action = {
      type: actionTypes.votesUpdated,
      data: {
        list: [{ username: 'username1', publicKey: 'sample_key' }],
      },
    };
    const updateVotesDirtyNotVotedExistingUsername = {
      username1: { confirmed: true, unconfirmed: false, pending: false, publicKey: 'sample_key' },
    };
    const state = {
      votes: { ...updateVotesDirtyNotVotedExistingUsername },
    };
    const votesRecordsUnchanged = {
      votes: { ...updateVotesDirtyNotVotedExistingUsername },
      refresh: false,
    };
    const changedState = voting(state, action);
    expect(changedState).to.be.deep.equal(votesRecordsUnchanged);
  });

  it('should set default (confirmed, unconfirmed, pending) values on username vote records, when non of previous cases are met', () => {
    const action = {
      type: actionTypes.votesUpdated,
      data: {
        list: [{ username: 'username1', publicKey: 'sample_key' }],
      },
    };
    const updateVotesNonConditionsMet = {
      username1: { confirmed: true, unconfirmed: true, pending: true, publicKey: 'sample_key' },
    };
    const state = {
      votes: { ...updateVotesNonConditionsMet },
    };
    const votesRecordsWithDefaultFlags = {
      votes: { username1: { ...defaultVoteUserData } },
      refresh: false,
    };
    const changedState = voting(state, action);
    expect(changedState).to.be.deep.equal(votesRecordsWithDefaultFlags);
  });

  it('should set voteLookupStatus of given username to given status, with action: voteLookupStatusUpdated', () => {
    const action = {
      type: actionTypes.voteLookupStatusUpdated,
      data: {
        username: 'username1',
        status: 'upvoted',
      },
    };
    const state = {
      voteLookupStatus: {
        [action.data.username]: 'pending',
        username2: 'pending',
      },
    };

    const expectedState = {
      voteLookupStatus: {
        [action.data.username]: action.data.status,
        username2: 'pending',
      },
    };
    const changedState = voting(state, action);

    expect(changedState).to.be.deep.equal(expectedState);
  });

  it('should set voteLookupStatus to {}, with action: voteLookupStatusCleared', () => {
    const action = {
      type: actionTypes.voteLookupStatusCleared,
    };
    const state = {
      voteLookupStatus: {
        username1: 'upvoted',
        username2: 'unvoted',
      },
    };

    const expectedState = {
      voteLookupStatus: {},
    };
    const changedState = voting(state, action);

    expect(changedState).to.be.deep.equal(expectedState);
  });
});
