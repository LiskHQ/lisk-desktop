import { expect } from 'chai';
import sinon from 'sinon';
import actionTypes from '../constants/actions';
import {
  voteToggled,
  voteLookupStatusUpdated,
  votePlaced,
  loadVotes,
  urlVotesFound,
  loadDelegates,
  delegatesAdded,
} from './voting';
import Fees from '../constants/fees';
import networks from '../constants/networks';
import { loginType } from '../constants/hwConstants';
import * as delegateApi from '../utils/api/delegates';

const delegateList = [
  { username: 'username1', publicKey: '123HG3452245L', address: '1234121321L' },
  { username: 'username2', publicKey: '123HG3522345L', address: '123L' },
];

const votesAdded = data => ({
  type: actionTypes.votesAdded,
  data,
});

describe('actions: voting', () => {
  let getState = () => ({
    peers: { liskAPIClient: {} },
    network: {
      name: networks.mainnet.name,
    },
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

  describe('votePlaced', () => {
    let delegateApiMock;
    const account = {
      publicKey: 'test_public-key',
      address: 'test_address',
      loginType: loginType.normal,
    };

    const secondSecret = null;
    const votes = {
      username1: { publicKey: 'sample_key', confirmed: true, unconfirmed: false },
      username2: { publicKey: 'sample_key', confirmed: false, unconfirmed: true },
    };

    let dispatch;
    let callback;
    let actionFunction;

    beforeEach(() => {
      delegateApiMock = sinon.stub(delegateApi, 'castVotes');
      dispatch = sinon.spy();
      callback = sinon.spy();
      actionFunction = votePlaced({
        account, votes, secondSecret, callback,
      });
    });

    afterEach(() => {
      delegateApiMock.restore();
    });

    it('should create an action function', () => {
      expect(typeof actionFunction).to.be.deep.equal('function');
    });

    it('should dispatch addPendingTransaction action if resolved', async () => {
      const transaction = {
        id: '15626650747375562521',
        senderPublicKey: account.publicKey,
        senderId: account.address,
        amount: 0,
        fee: Fees.vote,
        type: 3,
      };
      delegateApiMock.returnsPromise().resolves([transaction]);

      await actionFunction(dispatch, getState);
      expect(dispatch).to.have.been
        .calledWith({ data: transaction, type: actionTypes.addPendingTransaction });
    });

    it('should call callback with "success: false" if caught an error', async () => {
      const error = { message: 'sample message' };
      delegateApiMock.returnsPromise().rejects(error);

      await actionFunction(dispatch, getState);
      const expectedAction = { success: false, error };
      expect(callback).to.have.been.calledWith(expectedAction);
    });

    it('should dispatch error toast if not enought balance', async () => {
      await votePlaced({
        account: {
          ...account,
          balance: 0,
        },
        votes,
        secondSecret,
        callback,
      })(dispatch, getState);
      expect(dispatch).to.have.been.calledWith(sinon.match({
        type: actionTypes.toastDisplayed,
      }));
    });
  });

  describe('loadVotes', () => {
    let delegateApiMock;
    const data = {
      address: '8096217735672704724L',
    };
    const delegates = delegateList.map(delegate => ({
      ...delegate,
      confirmed: true,
      unconfirmed: true,
    }));

    beforeEach(() => {
      delegateApiMock = sinon.stub(delegateApi, 'getVotes').returnsPromise();
      getState = () => ({
        peers: { liskAPIClient: {} },
      });
    });

    afterEach(() => {
      delegateApiMock.restore();
    });


    it('should create an action function', () => {
      const actionFunction = loadVotes(data);
      expect(typeof actionFunction).to.be.deep.equal('function');
    });

    it('should dispatch votesAdded action when resolved if type !== \'update\'', () => {
      const dispatch = sinon.spy();

      delegateApiMock.resolves({ data: { votes: delegates } });
      const expectedAction = { list: delegates };

      loadVotes(data)(dispatch, getState);
      expect(dispatch).to.have.been.calledWith(votesAdded(expectedAction));
    });

    it('should dispatch votesUpdated action when resolved if type === \'update\'', () => {
      const dispatch = sinon.spy();

      delegateApiMock.resolves({ data: { votes: delegates } });
      const expectedAction = {
        type: actionTypes.votesUpdated,
        data: { list: delegates },
      };

      loadVotes({ ...data, type: 'update' })(dispatch, getState);
      expect(dispatch).to.have.been.calledWith(expectedAction);
    });
  });

  describe('loadDelegates', () => {
    const data = {
      q: '',
      offset: 0,
      refresh: true,
    };
    const delegates = delegateList;
    const actionFunction = loadDelegates(data);

    getState = () => ({
      peers: {
        liskAPIClient: {
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
      const delegateApiMock = sinon.stub(delegateApi, 'getDelegates');
      const dispatch = sinon.spy();
      getState = () => ({
        peers: {
          liskAPIClient: {
            options: {
              name: networks.mainnet.name,
            },
          },
          options: {
            name: networks.mainnet.name,
            code: networks.mainnet.code,
          },
        },
      });

      delegateApiMock.returnsPromise().resolves({ data: delegates });
      const expectedAction = { list: delegates, refresh: true };

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
      peers: { liskAPIClient: {} },
    });

    beforeEach(() => {
      delegateApiMock = sinon.stub(delegateApi, 'getVotes').returnsPromise();
      getState = () => ({
        peers: { liskAPIClient: {} },
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
