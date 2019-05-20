import { expect as chaiExpect } from 'chai';
import { spy, stub } from 'sinon';
import i18next from 'i18next';
import actionTypes from '../constants/actions';
import {
  accountUpdated,
  accountLoggedOut,
  secondPassphraseRegistered,
  delegateRegistered,
  removePassphrase,
  passphraseUsed,
  loadDelegate,
  accountDataUpdated,
  updateTransactionsIfNeeded,
  updateDelegateAccount,
  delegateStatsLoaded,
  updateAccountDelegateStats,
  login,
} from './account';
import { secondPassphraseRegisteredFailure } from './secondPassphrase';
import { delegateRegisteredFailure } from './delegate';
import * as accountApi from '../utils/api/account';
import * as delegateApi from '../utils/api/delegate';
import * as transactionsApi from '../utils/api/transactions';
import * as blocksApi from '../utils/api/blocks';
import Fees from '../constants/fees';
import transactionTypes from '../constants/transactionTypes';
import networks from '../constants/networks';
import accounts from '../../test/constants/accounts';
import * as peersActions from './peers';
import * as transactionsActions from './transactions';

jest.mock('../utils/api/account');

describe('actions: account', () => {
  describe('accountUpdated', () => {
    it('should create an action to set values to account', () => {
      const data = {
        passphrase: 'robust swift grocery peasant forget share enable convince deputy road keep cheap',
      };

      const expectedAction = {
        data,
        type: actionTypes.accountUpdated,
      };
      chaiExpect(accountUpdated(data)).to.be.deep.equal(expectedAction);
    });
  });

  describe('accountLoggedOut', () => {
    it('should create an action to reset the account', () => {
      const expectedAction = {
        type: actionTypes.accountLoggedOut,
      };

      chaiExpect(accountLoggedOut()).to.be.deep.equal(expectedAction);
    });
  });

  describe('secondPassphraseRegistered', () => {
    let accountApiMock;
    let i18nextMock;
    const data = {
      passphrase: accounts['second passphrase account'].passphrase,
      secondPassphrase: accounts['second passphrase account'].secondPassphrase,
      account: {
        publicKey: accounts['second passphrase account'].publicKey,
        address: accounts['second passphrase account'].address,
      },
    };
    const actionFunction = secondPassphraseRegistered(data);
    let dispatch;
    let getState;

    beforeEach(() => {
      accountApiMock = stub(accountApi, 'setSecondPassphrase');
      dispatch = spy();
      getState = () => ({
        peers: { liskAPIClient: {} },
      });
      i18nextMock = stub(i18next, 't');
      i18next.t = key => key;
    });

    afterEach(() => {
      accountApiMock.restore();
      i18nextMock.restore();
    });

    it('should create an action function', () => {
      chaiExpect(typeof actionFunction).to.be.deep.equal('function');
    });

    it('should dispatch addPendingTransaction action if resolved', () => {
      accountApiMock.returnsPromise().resolves({ id: '15626650747375562521' });
      const expectedAction = {
        id: '15626650747375562521',
        senderPublicKey: accounts['second passphrase account'].publicKey,
        senderId: accounts['second passphrase account'].address,
        amount: 0,
        fee: Fees.setSecondPassphrase,
        type: transactionTypes.setSecondPassphrase,
      };

      actionFunction(dispatch, getState);
      chaiExpect(dispatch).to.have.been
        .calledWith({ data: expectedAction, type: actionTypes.addPendingTransaction });
    });

    it('should dispatch secondPassphraseRegisteredFailure action if caught', () => {
      accountApiMock.returnsPromise().rejects({ message: 'sample message' });

      actionFunction(dispatch, getState);
      const expectedAction = secondPassphraseRegisteredFailure({ text: 'sample message' });
      chaiExpect(dispatch).to.have.been.calledWith(expectedAction);
    });

    it('should dispatch secondPassphraseRegisteredFailure action if caught but no message returned', () => {
      accountApiMock.returnsPromise().rejects({});

      actionFunction(dispatch, getState);
      const expectedAction = secondPassphraseRegisteredFailure({ text: 'An error occurred while registering your second passphrase. Please try again.' });
      chaiExpect(dispatch).to.have.been.calledWith(expectedAction);
    });
  });

  describe('delegateRegistered', () => {
    let delegateApiMock;
    const data = {
      username: 'test',
      passphrase: accounts.genesis.passphrase,
      secondPassphrase: null,
      account: {
        publicKey: accounts['second passphrase account'].publicKey,
        address: accounts['second passphrase account'].address,
      },
    };
    const actionFunction = delegateRegistered(data);
    let dispatch;
    let getState;

    beforeEach(() => {
      delegateApiMock = stub(delegateApi, 'registerDelegate');
      dispatch = spy();
      getState = () => ({
        peers: { liskAPIClient: {} },
        blocks: { latestBlocks: [] },
      });
    });

    afterEach(() => {
      delegateApiMock.restore();
    });

    it('should create an action function', () => {
      chaiExpect(typeof actionFunction).to.be.deep.equal('function');
    });

    it('should dispatch addPendingTransaction action if resolved', () => {
      delegateApiMock.returnsPromise().resolves({ id: '15626650747375562521' });
      const expectedAction = {
        id: '15626650747375562521',
        senderPublicKey: accounts['second passphrase account'].publicKey,
        senderId: accounts['second passphrase account'].address,
        username: data.username,
        amount: 0,
        fee: Fees.registerDelegate,
        type: transactionTypes.registerDelegate,
      };

      actionFunction(dispatch, getState);
      chaiExpect(dispatch).to.have.been
        .calledWith({ data: expectedAction, type: actionTypes.addPendingTransaction });
    });

    it('should dispatch delegateRegisteredFailure action if caught', () => {
      delegateApiMock.returnsPromise().rejects({ message: 'sample message.' });

      actionFunction(dispatch, getState);
      const delegateRegisteredFailureAction = delegateRegisteredFailure({ message: 'sample message.' });
      chaiExpect(dispatch).to.have.been.calledWith(delegateRegisteredFailureAction);
    });

    it('should dispatch passphraseUsed action always', () => {
      delegateApiMock.returnsPromise().rejects({ message: 'sample message.' });

      actionFunction(dispatch, getState);
      const passphraseUsedAction = passphraseUsed(accounts.genesis.passphrase);
      chaiExpect(dispatch).to.have.been.calledWith(passphraseUsedAction);
    });
  });

  describe('loadDelegate', () => {
    let delegateApiMock;
    let dispatch;
    let getState;

    const data = {
      publicKey: accounts.genesis.publicKey,
    };
    const actionFunction = loadDelegate(data);

    beforeEach(() => {
      delegateApiMock = stub(delegateApi, 'getDelegate');
      dispatch = spy();
      getState = () => ({
        peers: { liskAPIClient: {} },
      });
    });

    afterEach(() => {
      delegateApiMock.restore();
    });

    it('should dispatch updateDelegate with delegate response', () => {
      const delegateResponse = { delegate: { ...accounts['delegate candidate'] } };
      delegateApiMock.returnsPromise().resolves(delegateResponse);

      actionFunction(dispatch, getState);
      const updateDelegateAction = {
        data: delegateResponse,
        type: actionTypes.updateDelegate,
      };
      chaiExpect(dispatch).to.have.been.calledWith(updateDelegateAction);
    });
  });

  describe('removePassphrase', () => {
    it('should create an action to remove passphrase', () => {
      const data = {
        publicKey: accounts.genesis.publicKey,
        network: networks.testnet,
        address: accounts.genesis.address,
      };

      const expectedAction = {
        data,
        type: actionTypes.removePassphrase,
      };

      chaiExpect(removePassphrase(data)).to.be.deep.equal(expectedAction);
    });
  });

  describe('accountDataUpdated', () => {
    let peersActionsStub;
    let getAccountStub;
    let transactionsActionsStub;
    let getState;

    const dispatch = spy();

    beforeEach(() => {
      peersActionsStub = spy(peersActions, 'liskAPIClientUpdate');
      getAccountStub = stub(accountApi, 'getAccount').returnsPromise();
      transactionsActionsStub = spy(transactionsActions, 'transactionsUpdated');
      getState = () => ({
        peers: { liskAPIClient: {}, options: { code: 0 } },
      });
    });

    afterEach(() => {
      getAccountStub.restore();
      peersActionsStub.restore();
      transactionsActionsStub.restore();
    });

    it(`should call account API methods on ${actionTypes.newBlockCreated} action when online`, () => {
      getAccountStub.resolves({ balance: 10e8 });

      const data = {
        windowIsFocused: false,
        transactions: {
          pending: [{
            id: 12498250891724098,
          }],
          confirmed: [],
          account: { address: accounts['second passphrase account'].address, balance: 0 },
        },
        account: { address: accounts.genesis.address, balance: 0 },
      };

      accountDataUpdated(data)(dispatch, getState);
      chaiExpect(dispatch).to.have.callCount(4);
      chaiExpect(peersActionsStub).to.have.not.been.calledWith({ online: false, code: 'EUNAVAILABLE' });
    });

    it(`should call account API methods on ${actionTypes.newBlockCreated} action when offline`, () => {
      getAccountStub.rejects({ error: { code: 'EUNAVAILABLE' } });

      const data = {
        windowIsFocused: true,
        transactions: {
          pending: [{ id: 12498250891724098 }],
          confirmed: [],
          account: { address: accounts['second passphrase account'].address, balance: 0 },
        },
        account: { address: accounts.genesis.address },
      };

      accountDataUpdated(data)(dispatch, getState);
      chaiExpect(peersActionsStub).to.have.been.calledWith({ online: false, code: 'EUNAVAILABLE' });
    });
  });

  describe('updateTransactionsIfNeeded', () => {
    let transactionsActionsStub;
    let getState;

    const dispatch = spy();

    beforeEach(() => {
      transactionsActionsStub = spy(transactionsActions, 'transactionsUpdated');
      getState = () => ({
        peers: { liskAPIClient: {} },
      });
    });

    afterEach(() => {
      transactionsActionsStub.restore();
    });

    it('should update transactions when window is in focus', () => {
      const data = {
        transactions: { confirmed: [{ confirmations: 10 }], pending: [] },
        account: { address: accounts.genesis.address },
      };

      updateTransactionsIfNeeded(data, true)(dispatch, getState);
      chaiExpect(transactionsActionsStub).to.have.been.calledWith();
    });

    it('should update transactions when there are no recent transactions', () => {
      const data = {
        transactions: { confirmed: [{ confirmations: 10000 }], pending: [{ id: '123' }] },
        account: { address: accounts.genesis.address },
      };

      updateTransactionsIfNeeded(data, false)(dispatch, getState);
      chaiExpect(transactionsActionsStub).to.have.been.calledWith();
    });
  });

  describe('updateDelegateAccount', () => {
    const dispatch = spy();
    let getState;

    beforeEach(() => {
      stub(delegateApi, 'getDelegate').returnsPromise();
      getState = () => ({
        peers: { liskAPIClient: {} },
        account: {
          info: {
            LSK: {},
          },
        },
      });
    });

    afterEach(() => {
      delegateApi.getDelegate.restore();
    });

    it('should fetch delegate and update account', () => {
      delegateApi.getDelegate.resolves({ data: [{ account: 'delegate data' }] });
      const data = {
        publicKey: accounts.genesis.publicKey,
      };

      updateDelegateAccount(data)(dispatch, getState);

      const accountUpdatedAction = accountUpdated({ delegate: { account: 'delegate data' }, isDelegate: true });
      chaiExpect(dispatch).to.have.been.calledWith(accountUpdatedAction);
    });
  });

  describe('updateAccountDelegateStats', () => {
    const dispatch = spy();
    let getState;

    beforeEach(() => {
      stub(blocksApi, 'getBlocks').returnsPromise();
      stub(transactionsApi, 'getTransactions').returnsPromise();
      getState = () => ({
        peers: { liskAPIClient: {} },
      });
    });

    afterEach(() => {
      blocksApi.getBlocks.restore();
      transactionsApi.getTransactions.restore();
    });

    it('should fetch delegate stats and update account', async () => {
      blocksApi.getBlocks.resolves({ data: [{ timestamp: 1 }] });
      transactionsApi.getTransactions.resolves({ data: [{ timestamp: 2 }] });

      await updateAccountDelegateStats(accounts.genesis)(dispatch, getState);

      const delegateStatsLoadedAction = delegateStatsLoaded({
        lastBlock: 1,
        txDelegateRegister: { timestamp: 2 },
      });

      chaiExpect(dispatch).to.have.been.calledWith(delegateStatsLoadedAction);
    });
  });

  describe('login', () => {
    let dispatch;
    let state;
    const getState = () => (state);
    const balance = 10e8;
    const { passphrase, address, publicKey } = accounts.genesis;

    beforeEach(() => {
      dispatch = jest.fn();
      state = {
        network: {
          name: 'Mainnet',
        },
        settings: {
          autoLog: true,
        },
      };
      localStorage.setItem('btc', true); // TODO remove when enabling BTC
    });

    afterEach(() => {
      accountApi.getAccount.mockReset();
      localStorage.removeItem('btc'); // TODO remove when enabling BTC
    });

    it('should call account api and dispatch accountLoggedIn ', async () => {
      accountApi.getAccount.mockResolvedValue({ balance, address });
      await login({ passphrase })(dispatch, getState);
      expect(dispatch).toHaveBeenNthCalledWith(1, expect.objectContaining({
        type: actionTypes.accountLoading,
      }));

      expect(dispatch).toHaveBeenNthCalledWith(2, expect.objectContaining({
        type: actionTypes.accountLoggedIn,
        data: expect.objectContaining({
          passphrase,
          info: {
            LSK: expect.objectContaining({
              address,
              balance,
            }),
          },
        }),
      }));
      expect(dispatch).toHaveBeenNthCalledWith(3, expect.objectContaining({
        type: actionTypes.accountUpdated,
        data: expect.objectContaining({
          address,
          balance,
        }),
      }));
    });

    it('should call account api and dispatch accountLoggedIn with ledger loginType', async () => {
      accountApi.getAccount.mockResolvedValue({ balance, address });
      await login({ hwInfo: {}, publicKey })(dispatch, getState);
      expect(dispatch).toHaveBeenNthCalledWith(2, expect.objectContaining({
        type: actionTypes.accountLoggedIn,
        data: expect.objectContaining({
          info: {
            LSK: expect.objectContaining({
              address,
              balance,
            }),
          },
        }),
      }));
    });

    it('should dispatch errorToastDisplayed if getAccount fails ', async () => {
      accountApi.getAccount.mockRejectedValue({ error: 'custom error' });
      await login({ passphrase })(dispatch, getState);
      expect(dispatch).toHaveBeenNthCalledWith(2, expect.objectContaining({
        type: actionTypes.toastDisplayed,
      }));
    });
  });
});
