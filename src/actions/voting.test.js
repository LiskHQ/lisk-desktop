import { expect } from 'chai';
import sinon from 'sinon';
import actionTypes from '../constants/actions';
import {
  pendingVotesAdded,
  clearVoteLists,
  votesAdded,
  voteToggled,
  votePlaced,
  votesFetched,
  delegatesFetched,
  delegatesAdded,
} from './voting';
import Fees from '../constants/fees';
import { transactionAdded } from './transactions';
import { errorAlertDialogDisplayed } from './dialog';
import * as delegateApi from '../utils/api/delegate';

describe('actions: voting', () => {
  describe('voteToggled', () => {
    it('should create an action to add data to toggle the vote status for any given delegate', () => {
      const data = {
        label: 'dummy',
      };
      const expectedAction = {
        data,
        type: actionTypes.voteToggled,
      };

      expect(voteToggled(data)).to.be.deep.equal(expectedAction);
    });
  });

  describe('votesAdded', () => {
    it('should create an action to remove data from vote list', () => {
      const data = [
        { username: 'username1', publicKey: '123HG3452245L' },
        { username: 'username2', publicKey: '123HG3522345L' },
      ];
      const expectedAction = {
        data,
        type: actionTypes.votesAdded,
      };

      expect(votesAdded(data)).to.be.deep.equal(expectedAction);
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
    const secondSecret = null;
    const votes = {
      username1: { publicKey: 'sample_key', confirmed: true, unconfirmed: false },
      username2: { publicKey: 'sample_key', confirmed: false, unconfirmed: true },
    };

    const actionFunction = votePlaced({
      activePeer, account, votes, secondSecret,
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

  describe('votesFetched', () => {
    const data = {
      activePeer: {},
      address: '8096217735672704724L',
    };
    const delegates = [
      { username: 'username1', publicKey: '80962134535672704724L' },
      { username: 'username2', publicKey: '80962134535672704725L' },
    ];
    const actionFunction = votesFetched(data);

    it('should create an action function', () => {
      expect(typeof actionFunction).to.be.deep.equal('function');
    });

    it.skip('should dispatch votesAdded action if resolved', () => {
      const delegateApiMock = sinon.stub(delegateApi, 'listAccountDelegates');
      const dispatch = sinon.spy();

      delegateApiMock.returnsPromise().resolves({ delegates });
      const expectedAction = { list: delegates };

      actionFunction(dispatch);
      expect(dispatch).to.have.been.calledWith(votesAdded(expectedAction));
      delegateApiMock.restore();
    });
  });

  describe('delegatesFetched', () => {
    const data = {
      activePeer: {},
      q: '',
      offset: 0,
      refresh: true,
    };
    const delegates = [
      { username: 'username1', publicKey: '80962134535672704724L' },
      { username: 'username2', publicKey: '80962134535672704725L' },
    ];
    const actionFunction = delegatesFetched(data);

    it('should create an action function', () => {
      expect(typeof actionFunction).to.be.deep.equal('function');
    });

    it('should dispatch delegatesAdded action if resolved', () => {
      const delegateApiMock = sinon.stub(delegateApi, 'listDelegates');
      const dispatch = sinon.spy();

      delegateApiMock.returnsPromise().resolves({ delegates, totalCount: 10 });
      const expectedAction = { list: delegates, totalDelegates: 10, refresh: true };

      actionFunction(dispatch);
      expect(dispatch).to.have.been.calledWith(delegatesAdded(expectedAction));
      delegateApiMock.restore();
    });
  });
});
