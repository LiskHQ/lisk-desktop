import { expect } from 'chai';
import sinon from 'sinon';
import { toast } from 'react-toastify';
import actionTypes from '../constants/actions';
import {
  voteToggled,
  votePlaced,
  loadVotes,
} from './voting';
import networks from '../constants/networks';
import { loginType } from '../constants/hwConstants';
import * as delegateApi from '../utils/api/delegates';
import accounts from '../../test/constants/accounts';

const delegateList = [
  { username: 'username1', publicKey: '123HG3452245L', address: '1234121321L' },
  { username: 'username2', publicKey: '123HG3522345L', address: '123L' },
];

const votesAdded = data => ({
  type: actionTypes.votesAdded,
  data,
});

describe('actions: voting', () => {
  let getState;

  beforeEach(() => {
    getState = () => ({
      network: {
        name: networks.mainnet.name,
        networks: {
          LSK: {
          },
        },
      },
    });
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

  describe('votePlaced', () => {
    let delegateApiMock;
    const account = {
      publicKey: accounts.genesis.publicKey,
      address: accounts.genesis.address,
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

    it.skip('should dispatch addNewPendingTransaction action if resolved', async () => {
      const transaction = {
        id: '15626650747375562521',
        senderPublicKey: account.publicKey,
        senderId: account.address,
        amount: 0,
        fee: 1e8,
        type: 3,
        token: 'LSK',
      };
      delegateApiMock.resolves([transaction]);

      actionFunction(dispatch, getState);
      await Promise.resolve('This await ensures that the async logic in the action is executed before the assertion');
      expect(dispatch).to.have.been
        .calledWith({ data: transaction, type: actionTypes.addNewPendingTransaction });
    });

    it.skip('should call callback with "success: false" if caught an error', async () => {
      const error = { message: 'sample message' };
      delegateApiMock.rejects(error);

      actionFunction(dispatch, getState);
      await Promise.resolve('This await ensures that the async logic in the action is executed before the assertion');
      const expectedAction = { success: false, error };
      expect(callback).to.have.been.calledWith(expectedAction);
    });

    it.skip('should dispatch error toast if not enought balance', async () => {
      toast.error = sinon.spy();
      votePlaced({
        account: {
          ...account,
          balance: 0,
        },
        votes,
        secondSecret,
        callback,
      })(dispatch, getState);
      await Promise.resolve('This await ensures that the async logic in the action is executed before the assertion');
      expect(toast.error).to.have.been.calledWith();
    });
  });

  describe('loadVotes', () => {
    let delegateApiMock;
    const data = {
      address: '8096217735672704724L',
    };
    const delegates = delegateList;

    beforeEach(() => {
      delegateApiMock = sinon.stub(delegateApi, 'getVotes');
    });

    afterEach(() => {
      delegateApiMock.restore();
    });


    it('should create an action function', () => {
      const actionFunction = loadVotes(data);
      expect(typeof actionFunction).to.be.deep.equal('function');
    });

    it('should dispatch votesAdded action when resolved if type !== \'update\'', async () => {
      const dispatch = sinon.spy();

      delegateApiMock.resolves({ data: { votes: delegates } });
      const expectedAction = { list: delegates };

      loadVotes(data)(dispatch, getState);
      await Promise.resolve('This await ensures that the async logic in the action is executed before the assertion');
      expect(dispatch).to.have.been.calledWith(votesAdded(expectedAction));
    });

    it('should dispatch votesConfirmed action when resolved if type === \'update\'', async () => {
      const dispatch = sinon.spy();

      delegateApiMock.resolves({ data: { votes: delegates } });
      const expectedAction = {
        type: actionTypes.votesConfirmed,
        data: { list: delegates },
      };

      loadVotes({ ...data, type: 'update' })(dispatch, getState);
      await Promise.resolve('This await ensures that the async logic in the action is executed before the assertion');
      expect(dispatch).to.have.been.calledWith(expectedAction);
    });
  });
});
