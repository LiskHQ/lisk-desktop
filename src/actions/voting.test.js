import { expect } from 'chai';
import actionTypes from '../constants/actions';
import {
    addedToVoteList,
    removedFromVoteList,
    clearVoteLists,
    pendingVotesAdded,
} from './voting';

describe('actions: voting', () => {
  const data = {
    label: 'dummy',
  };

  describe('addedToVoteList', () => {
    it('should create an action to add data to vote list', () => {
      const expectedAction = {
        data,
        type: actionTypes.addedToVoteList,
      };
      expect(addedToVoteList(data)).to.be.deep.equal(expectedAction);
    });
  });

  describe('removedFromVoteList', () => {
    it('should create an action to remove data from vote list', () => {
      const expectedAction = {
        data,
        type: actionTypes.removedFromVoteList,
      };
      expect(removedFromVoteList(data)).to.be.deep.equal(expectedAction);
    });
  });
  describe('clearVoteLists', () => {
    it('should create an action to remove all pending rows from vote list', () => {
      const expectedAction = {
        type: actionTypes.votesCleared,
      };
      expect(clearVoteLists()).to.be.deep.equal(expectedAction);
    });
  });
  describe('pendingVotesAdded', () => {
    it('should create an action to remove all pending rows from vote list', () => {
      const expectedAction = {
        type: actionTypes.pendingVotesAdded,
      };
      expect(pendingVotesAdded()).to.be.deep.equal(expectedAction);
    });
  });
});
