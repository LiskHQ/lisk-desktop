import { expect } from 'chai';
import sinon from 'sinon';
import actionTypes from '../constants/actions';
import {
  pendingVotesAdded,
  votesUpdated,
  votesAdded,
  voteToggled,
  voteLookupStatusUpdated,
  votePlaced,
  votesFetched,
  urlVotesFound,
  delegatesFetched,
  delegatesAdded,
} from './voting';
import Fees from '../constants/fees';
import networks from '../constants/networks';
import * as delegateApi from '../utils/api/delegate';

const delegateList = [
  { username: 'username1', publicKey: '123HG3452245L', address: '1234121321L' },
  { username: 'username2', publicKey: '123HG3522345L', address: '123L' },
];

describe('actions: voting', () => {
  let getState = () => ({
    peers: { data: {} },
  });

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

  describe('voteLookupStatusUpdated', () => {
    it('should create an action to update lookup status of any given delegate name', () => {
      const data = {
        label: 'dummy',
      };
      const expectedAction = {
        data,
        type: actionTypes.voteLookupStatusUpdated,
      };

      expect(voteLookupStatusUpdated(data)).to.be.deep.equal(expectedAction);
    });
  });

  describe('votesAdded', () => {
    it('should create an action to remove data from vote list', () => {
      const data = delegateList;
      const expectedAction = {
        data,
        type: actionTypes.votesAdded,
      };

      expect(votesAdded(data)).to.be.deep.equal(expectedAction);
    });
  });

  describe('votesUpdated', () => {
    it('should create an action to update the votes dictionary', () => {
      const expectedAction = {
        type: actionTypes.votesUpdated,
        data: { list: delegateList },
      };
      const createdAction = votesUpdated({ list: delegateList });
      expect(createdAction).to.be.deep.equal(expectedAction);
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

    const secondSecret = null;
    const votes = {
      username1: { publicKey: 'sample_key', confirmed: true, unconfirmed: false },
      username2: { publicKey: 'sample_key', confirmed: false, unconfirmed: true },
    };

    let dispatch;
    let goToNextStep;
    let actionFunction;

    beforeEach(() => {
      delegateApiMock = sinon.stub(delegateApi, 'vote');
      dispatch = sinon.spy();
      goToNextStep = sinon.spy();
      actionFunction = votePlaced({
        account, votes, secondSecret, goToNextStep,
      });
      getState = () => ({
        peers: { data: {} },
      });
    });

    afterEach(() => {
      delegateApiMock.restore();
    });

    it('should create an action function', () => {
      expect(typeof actionFunction).to.be.deep.equal('function');
    });

    it('should dispatch transactionAdded action if resolved', () => {
      delegateApiMock.returnsPromise().resolves({ id: '15626650747375562521' });
      const expectedAction = {
        id: '15626650747375562521',
        senderPublicKey: account.publicKey,
        senderId: account.address,
        amount: 0,
        fee: Fees.vote,
        type: 3,
      };

      actionFunction(dispatch, getState);
      expect(dispatch).to.have.been
        .calledWith({ data: expectedAction, type: actionTypes.transactionAdded });
    });

    it('should call goToNextStep with "success: false" if caught an error', () => {
      delegateApiMock.returnsPromise().rejects({ message: 'sample message' });

      actionFunction(dispatch, getState);
      const expectedAction = { success: false, text: 'sample message.' };
      expect(goToNextStep).to.have.been.calledWith(expectedAction);
    });

    it('should call goToNextStep with "success: false" and default message if caught an error but no message returned', () => {
      delegateApiMock.returnsPromise().rejects({});
      actionFunction(dispatch, getState);
      const expectedAction = { success: false, text: 'An error occurred while placing your vote.' };
      expect(goToNextStep).to.have.been.calledWith(expectedAction);
    });
  });

  describe('votesFetched', () => {
    let delegateApiMock;
    const data = {
      address: '8096217735672704724L',
    };
    const delegates = delegateList;

    beforeEach(() => {
      delegateApiMock = sinon.stub(delegateApi, 'listAccountDelegates').returnsPromise();
      getState = () => ({
        peers: { data: {} },
      });
    });

    afterEach(() => {
      delegateApiMock.restore();
    });


    it('should create an action function', () => {
      const actionFunction = votesFetched(data);
      expect(typeof actionFunction).to.be.deep.equal('function');
    });

    it('should dispatch votesAdded action when resolved if type !== \'update\'', () => {
      const dispatch = sinon.spy();

      delegateApiMock.resolves({ data: { votes: delegates } });
      const expectedAction = { list: delegates };

      votesFetched(data)(dispatch, getState);
      expect(dispatch).to.have.been.calledWith(votesAdded(expectedAction));
    });

    it('should dispatch votesUpdated action when resolved if type === \'update\'', () => {
      const dispatch = sinon.spy();

      delegateApiMock.resolves({ data: { votes: delegates } });
      const expectedAction = { list: delegates };

      votesFetched({ ...data, type: 'update' })(dispatch, getState);
      expect(dispatch).to.have.been.calledWith(votesUpdated(expectedAction));
    });
  });

  describe('delegatesFetched', () => {
    const data = {
      q: '',
      offset: 0,
      refresh: true,
    };
    const delegates = delegateList;
    const actionFunction = delegatesFetched(data);

    getState = () => ({
      peers: {
        data: {
          options: {
            name: networks.mainnet.name,
          },
        },
      },
    });

    it('should create an action function', () => {
      expect(typeof actionFunction).to.be.deep.equal('function');
    });

    it('should dispatch delegatesAdded action if resolved', () => {
      const delegateApiMock = sinon.stub(delegateApi, 'listDelegates');
      const dispatch = sinon.spy();
      getState = () => ({
        peers: {
          data: {
            options: {
              name: networks.mainnet.name,
            },
          },
        },
      });

      delegateApiMock.returnsPromise().resolves({ data: delegates });
      const expectedAction = { list: delegates, totalDelegates: delegates.length, refresh: true };

      actionFunction(dispatch, getState);
      expect(dispatch).to.have.been.calledWith(delegatesAdded(expectedAction));
      delegateApiMock.restore();
    });
  });

  describe('urlVotesFound', () => {
    let delegateApiMock;
    const data = {
      address: '8096217735672704724L',
      upvotes: [],
      unvotes: [],
    };
    const delegates = delegateList;
    let expectedAction = {
      list: delegates,
      upvotes: [],
      unvotes: [],
    };

    getState = () => ({
      peers: { data: {} },
    });

    beforeEach(() => {
      delegateApiMock = sinon.stub(delegateApi, 'listAccountDelegates').returnsPromise();
      getState = () => ({
        peers: { data: {} },
      });
    });

    afterEach(() => {
      delegateApiMock.restore();
    });

    it('should create an action function', () => {
      expect(typeof urlVotesFound(data)).to.be.deep.equal('function');
    });

    it('should dispatch votesAdded action when resolved', () => {
      const dispatch = sinon.spy();


      urlVotesFound(data)(dispatch, getState);
      delegateApiMock.resolves({ data: { votes: delegates } });
      expect(dispatch).to.have.been.calledWith(votesAdded(expectedAction));
    });

    it('should dispatch votesAdded action when rejected', () => {
      const dispatch = sinon.spy();

      expectedAction = {
        ...expectedAction,
        list: [],
      };

      urlVotesFound(data)(dispatch, getState);
      delegateApiMock.rejects();
      expect(dispatch).to.have.been.calledWith(votesAdded(expectedAction));
    });
  });
});
