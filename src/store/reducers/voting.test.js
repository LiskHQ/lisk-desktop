import { expect } from 'chai';
import actionTypes from '../../constants/actions';
import voting from './voting';

describe('Reducer: voting(state, action)', () => {
  const state = {
    votedList: [
      {
        address: 'voted address1',
      },
      {
        address: 'voted address2',
      },
    ],
    unvotedList: [
      {
        address: 'unvoted address1',
      },
      {
        address: 'unvoted address2',
      },
    ],
  };
  it('should render default state', () => {
    const action = {
      type: '',
    };
    const changedState = voting(state, action);
    expect(changedState).to.be.equal(state);
  });
  it('should be 1 items in state.unvotedList', () => {
    const action = {
      type: actionTypes.addedToVoteList,
      data: {
        voted: true,
        address: 'unvoted address1',
      },
    };
    const changedState = voting(state, action);
    expect(changedState.unvotedList).to.have.lengthOf(1);
  });

  it('should return state if action.data existed in votedList before', () => {
    const action = {
      type: actionTypes.addedToVoteList,
      data: {
        address: 'voted address1',
      },
    };
    const changedState = voting(state, action);
    expect(changedState).to.be.deep.equal(state);
  });

  it('should be 3 items in state.votedList', () => {
    const action = {
      type: actionTypes.addedToVoteList,
      data: {
        address: 'voted address3',
      },
    };
    const changedState = voting(state, action);
    expect(changedState.votedList).to.have.lengthOf(3);
  });

  it('should be 1 items in state.votedList', () => {
    const action = {
      type: actionTypes.removedFromVoteList,
      data: {
        voted: false,
        address: 'voted address1',
      },
    };
    const changedState = voting(state, action);
    expect(changedState.votedList).to.have.lengthOf(1);
  });

  it('should return state if action.data existed in unvotedList before', () => {
    const action = {
      type: actionTypes.removedFromVoteList,
      data: {
        voted: true,
        address: 'unvoted address2',
      },
    };
    const changedState = voting(state, action);
    expect(changedState).to.be.deep.equal(state);
  });

  it('should be 3 items in state.unvotedList', () => {
    const action = {
      type: actionTypes.removedFromVoteList,
      data: {
        voted: true,
        address: 'unvoted address3',
      },
    };
    const changedState = voting(state, action);
    expect(changedState.unvotedList).to.have.lengthOf(3);
  });

  it('should add pending to all items in votedList and unvotedList', () => {
    const action = {
      type: actionTypes.pendingVotesAdded,
    };
    const expectedState = {
      votedList: [
        {
          address: 'voted address1',
          pending: true,
        },
        {
          address: 'voted address2',
          pending: true,
        },
      ],
      unvotedList: [
        {
          address: 'unvoted address1',
          pending: true,
        },
        {
          address: 'unvoted address2',
          pending: true,
        },
      ],
    };
    const changedState = voting(state, action);
    expect(changedState).to.be.deep.equal(expectedState);
  });

  it('should remove all pending in votedList and unvotedList', () => {
    const action = {
      type: actionTypes.votesCleared,
    };
    const changedState = voting(state, action);
    expect(changedState.unvotedList).to.have.lengthOf(0);
    expect(changedState.votedList).to.have.lengthOf(0);
    expect(changedState.refresh).to.be.equal(true);
  });
});
