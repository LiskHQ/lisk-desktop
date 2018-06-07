import { expect } from 'chai';
import actionTypes from '../../constants/actions';
import voting from './voting';

describe('Reducer: voting(state, action)', () => {
  const initialState = { votes: {}, delegates: [], refresh: true };
  const delegate1 = {
    publicKey: 'sample_key_1', address: '100001L', rank: 1, productivity: 99,
  };
  const delegate2 = {
    publicKey: 'sample_key_2', address: '100002L', rank: 2, productivity: 98,
  };
  const delegate3 = {
    publicKey: 'sample_key_3', address: '100003L', rank: 3, productivity: 97,
  };
  const delegate4 = {
    publicKey: 'sample_key_4', address: '100004L', rank: 4, productivity: 96,
  };
  const delegate5 = {
    publicKey: 'sample_key_5', address: '100005L', rank: 5, productivity: 95,
  };
  const cleanVotes = {
    username1: { confirmed: false, unconfirmed: false, ...delegate1 },
    username2: { confirmed: true, unconfirmed: true, ...delegate2 },
    username3: { confirmed: false, unconfirmed: false, ...delegate3 },
  };
  const dirtyVotes = {
    username1: { confirmed: false, unconfirmed: true, ...delegate1 },
    username2: { confirmed: true, unconfirmed: true, ...delegate2 },
    username3: { confirmed: false, unconfirmed: false, ...delegate3 },
  };
  const pendingVotes = {
    username1: {
      confirmed: true, unconfirmed: true, pending: true, ...delegate1,
    },
    username2: {
      confirmed: true, unconfirmed: true, pending: false, ...delegate2,
    },
    username3: {
      confirmed: false, unconfirmed: false, pending: false, ...delegate3,
    },
  };

  const restoredVotes = {
    username1: {
      confirmed: false, unconfirmed: false, pending: false, ...delegate1,
    },
    username2: {
      confirmed: true, unconfirmed: true, pending: false, ...delegate2,
    },
    username3: {
      confirmed: false, unconfirmed: false, pending: false, ...delegate3,
    },
  };

  const delegateList1 = [{ username: 'username1', ...delegate1 }, { username: 'username2', ...delegate2 }];
  const delegateList2 = [{ username: 'username3', ...delegate3 }, { username: 'username4', ...delegate4 }];
  const fullDelegates = [...delegateList1, ...delegateList2];

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
        list: delegateList1,
      },
    };
    const expectedState = {
      votes: {
        username1: { confirmed: true, unconfirmed: true, ...delegate1 },
        username2: { confirmed: true, unconfirmed: true, ...delegate2 },
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
        list: delegateList2,
        totalCount: 100,
        refresh: false,
      },
    };
    const state = {
      delegates: delegateList1,
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
        list: delegateList1,
        totalDelegates: 100,
        refresh: true,
      },
    };
    const state = {
      delegates: delegateList2,
    };
    const expectedState = {
      delegates: delegateList1,
      refresh: true,
      totalDelegates: 100,
    };
    const changedState = voting(state, action);

    expect(changedState).to.be.deep.equal(expectedState);
  });

  it('should toggle unconfirmed state, with action: voteToggled', () => {
    const action = {
      type: actionTypes.voteToggled,
      data: delegateList1[0],
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
      data: delegateList1[0],
    };
    const expectedState = {
      votes: {
        [delegateList1[0].username]: dirtyVotes[delegateList1[0].username],
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
        list: [{ username: 'username5', ...delegate5 }],
      },
    };
    const votedButNotYetInList = {
      username1: {
        confirmed: true, unconfirmed: true, pending: true, ...delegate1,
      },
    };
    const state = {
      votes: { ...votedButNotYetInList },
    };
    const newUserNameRegisteredInVotes = {
      votes: {
        ...votedButNotYetInList,
        username5: {
          confirmed: true, unconfirmed: true, pending: false, ...delegate5,
        },
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
        list: [{ username: 'username1', ...delegate1 }],
      },
    };
    const updateVotesUnvotedWithExistingUsername = {
      username1: {
        confirmed: true, unconfirmed: false, pending: true, ...delegate1,
      },
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
        list: [{ username: 'username5', ...delegate5 }],
      },
    };
    const updateVotesDirtyNotVotedNotExistingUsername = {
      username1: {
        confirmed: true, unconfirmed: false, pending: false, ...delegate1,
      },
    };
    const state = {
      votes: { ...updateVotesDirtyNotVotedNotExistingUsername },
    };
    const newUsernameAddedToVotes = {
      votes: {
        ...updateVotesDirtyNotVotedNotExistingUsername,
        username5: {
          confirmed: true, unconfirmed: true, pending: false, ...delegate5,
        },
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
        list: [{ username: 'username1', ...delegate1 }],
      },
    };
    const updateVotesDirtyNotVotedExistingUsername = {
      username1: {
        confirmed: true, unconfirmed: false, pending: false, ...delegate1,
      },
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
        list: [{ username: 'username1', ...delegate1 }],
      },
    };
    const updateVotesNonConditionsMet = {
      username1: {
        confirmed: true, unconfirmed: true, pending: true, ...delegate1,
      },
    };
    const state = {
      votes: { ...updateVotesNonConditionsMet },
    };
    const votesRecordsWithDefaultFlags = {
      votes: {
        username1: {
          confirmed: true, unconfirmed: true, pending: false, ...delegate1,
        },
      },
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
