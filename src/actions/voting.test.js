import { expect } from 'chai';
import sinon from 'sinon';
import actionTypes from '../constants/actions';
import {
    addedToVoteList,
    removedFromVoteList,
    clearVoteLists,
    pendingVotesAdded,
    votePlaced,
} from './voting';
import Fees from '../constants/fees';
import { transactionAdded } from './transactions';
import { errorAlertDialogDisplayed } from './dialog';
import * as delegateApi from '../utils/api/delegate';

describe('actions: voting', () => {
  describe('addedToVoteList', () => {
    it('should create an action to add data to vote list', () => {
      const data = {
        label: 'dummy',
      };
      const expectedAction = {
        data,
        type: actionTypes.addedToVoteList,
      };

      expect(addedToVoteList(data)).to.be.deep.equal(expectedAction);
    });
  });

  describe('removedFromVoteList', () => {
    it('should create an action to remove data from vote list', () => {
      const data = {
        label: 'dummy',
      };
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

  describe('votePlaced', () => {
    let delegateApiMock;
    const account = {
      publicKey: 'test_public-key',
      address: 'test_address',
    };
    const activePeer = {};
    const votedList = [];
    const unvotedList = [];
    const secondSecret = null;

    const actionFunction = votePlaced({
      activePeer, account, votedList, unvotedList, secondSecret,
    });
    let dispatch;

    beforeEach(() => {
      delegateApiMock = sinon.stub(delegateApi, 'vote');
      dispatch = sinon.spy();
    });

    afterEach(() => {
      delegateApiMock.restore();
    });

    it('should create an action function', () => {
      expect(typeof actionFunction).to.be.deep.equal('function');
    });

    it('should dispatch transactionAdded action if resolved', () => {
      delegateApiMock.returnsPromise().resolves({ transactionId: '15626650747375562521' });
      const expectedAction = {
        id: '15626650747375562521',
        senderPublicKey: account.publicKey,
        senderId: account.address,
        amount: 0,
        fee: Fees.vote,
        type: 3,
      };

      actionFunction(dispatch);
      expect(dispatch).to.have.been.calledWith(transactionAdded(expectedAction));
    });

    it('should dispatch errorAlertDialogDisplayed action if caught', () => {
      delegateApiMock.returnsPromise().rejects({ message: 'sample message' });

      actionFunction(dispatch);
      const expectedAction = errorAlertDialogDisplayed({ text: 'sample message.' });
      expect(dispatch).to.have.been.calledWith(expectedAction);
    });

    it('should dispatch errorAlertDialogDisplayed action if caught but no message returned', () => {
      delegateApiMock.returnsPromise().rejects({});

      actionFunction(dispatch);
      const expectedAction = errorAlertDialogDisplayed({ text: 'An error occurred while placing your vote.' });
      expect(dispatch).to.have.been.calledWith(expectedAction);
    });
  });
});
