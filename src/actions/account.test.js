import { expect as chaiExpect } from 'chai';
import { spy, stub } from 'sinon';
import i18next from 'i18next';
import actionTypes from '../constants/actions';
import {
  accountUpdated,
  accountLoggedOut,
  secondPassphraseRegistered,
  removePassphrase,
  accountDataUpdated,
  updateTransactionsIfNeeded,
  updateDelegateAccount,
  updateAccountDelegateStats,
  login,
} from './account';
import * as accountApi from '../utils/api/account';
import * as delegateApi from '../utils/api/delegates';
import * as transactionsApi from '../utils/api/transactions';
import * as blocksApi from '../utils/api/blocks';
import Fees from '../constants/fees';
import transactionTypes from '../constants/transactionTypes';
import networks from '../constants/networks';
import accounts from '../../test/constants/accounts';
import * as networkActions from './network';
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
      passphrase: accounts.second_passphrase_account.passphrase,
      secondPassphrase: accounts.second_passphrase_account.secondPassphrase,
      account: accounts.second_passphrase_account,
      callback: jest.fn(),
    };
    const actionFunction = secondPassphraseRegistered(data);
    let dispatch;
    let getState;

    beforeEach(() => {
      accountApiMock = stub(accountApi, 'setSecondPassphrase');
      dispatch = jest.fn();
      getState = () => ({
        network: {
          status: { online: true },
          name: 'Mainnet',
          networks: {
            LSK: {
              nodeUrl: 'hhtp://localhost:4000',
              nethash: '198f2b61a8eb95fbeed58b8216780b68f697f26b849acf00c8c93bb9b24f783d',
            },
          },
        },
        settings: {
          token: {
            active: 'LSK',
          },
        },
      });
      i18nextMock = stub(i18next, 't');
      i18next.t = key => key;
    });

    afterEach(() => {
      accountApiMock.restore();
      i18nextMock.restore();
    });

    it('should dispatch addPendingTransaction action if resolved', () => {
      const transaction = {
        id: '15626650747375562521',
        senderPublicKey: accounts.second_passphrase_account.publicKey,
        senderId: accounts.second_passphrase_account.address,
        amount: 0,
        fee: Fees.setSecondPassphrase,
        type: transactionTypes.setSecondPassphrase,
        token: 'LSK',
      };
      accountApiMock.returnsPromise().resolves(transaction);

      actionFunction(dispatch, getState);
      expect(dispatch).toHaveBeenCalledWith({
        data: transaction, type: actionTypes.addPendingTransaction,
      });
      expect(data.callback).toHaveBeenCalledWith({
        success: true,
        transaction,
      });
    });

    it('should call callback if api call fails', () => {
      const error = { message: 'sample message' };
      accountApiMock.returnsPromise().rejects(error);

      actionFunction(dispatch, getState);
      expect(data.callback).toHaveBeenCalledWith({
        success: false,
        error,
        message: error.message,
      });
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
    let networkActionsStub;
    let getAccountStub;
    let transactionsActionsStub;
    let getState;

    const dispatch = spy();

    beforeEach(() => {
      networkActionsStub = spy(networkActions, 'networkStatusUpdated');
      getAccountStub = stub(accountApi, 'getAccount').returnsPromise();
      transactionsActionsStub = spy(transactionsActions, 'updateTransactions');
      getState = () => ({
        network: {
          status: { online: true },
          name: 'Mainnet',
          networks: {
            LSK: {
              nodeUrl: 'hhtp://localhost:4000',
              nethash: '198f2b61a8eb95fbeed58b8216780b68f697f26b849acf00c8c93bb9b24f783d',
            },
          },
        },
        settings: {
          token: {
            active: 'LSK',
          },
        },
      });
    });

    afterEach(() => {
      getAccountStub.restore();
      networkActionsStub.restore();
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
          account: { address: accounts.second_passphrase_account.address, balance: 0 },
        },
        account: { address: accounts.genesis.address, balance: 0 },
      };

      accountDataUpdated(data)(dispatch, getState);
      chaiExpect(dispatch).to.have.callCount(3);
      chaiExpect(networkActionsStub).to.have.not.been.calledWith({ online: false, code: 'EUNAVAILABLE' });
    });

    it(`should call account API methods on ${actionTypes.newBlockCreated} action when offline`, () => {
      getAccountStub.rejects({ error: { code: 'EUNAVAILABLE' } });

      const data = {
        windowIsFocused: true,
        transactions: {
          pending: [{ id: 12498250891724098 }],
          confirmed: [],
          account: { address: accounts.second_passphrase_account.address, balance: 0 },
        },
        account: { address: accounts.genesis.address },
      };

      accountDataUpdated(data)(dispatch, getState);
      chaiExpect(networkActionsStub).to.have.been.calledWith({ online: false, code: 'EUNAVAILABLE' });
    });
  });

  describe('updateTransactionsIfNeeded', () => {
    let transactionsActionsStub;
    let getState;

    const dispatch = spy();

    beforeEach(() => {
      transactionsActionsStub = spy(transactionsActions, 'updateTransactions');
      getState = () => ({
        network: {
          status: { online: true },
          name: 'Mainnet',
          networks: {
            LSK: {
              nodeUrl: 'hhtp://localhost:4000',
              nethash: '198f2b61a8eb95fbeed58b8216780b68f697f26b849acf00c8c93bb9b24f783d',
            },
          },
        },
        settings: {
          token: {
            active: 'LSK',
          },
        },
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
      stub(delegateApi, 'getDelegates').returnsPromise();
      getState = () => ({
        network: {
          status: { online: true },
          name: 'Mainnet',
          networks: {
            LSK: {
              nodeUrl: 'hhtp://localhost:4000',
              nethash: '198f2b61a8eb95fbeed58b8216780b68f697f26b849acf00c8c93bb9b24f783d',
            },
          },
        },
        account: {
          info: {
            LSK: {},
          },
        },
        settings: {
          token: {
            active: 'LSK',
          },
        },
      });
    });

    afterEach(() => {
      delegateApi.getDelegates.restore();
    });

    it('should fetch delegate and update account', () => {
      delegateApi.getDelegates.resolves({ data: [{ account: 'delegate data' }] });
      const data = {
        publicKey: accounts.genesis.publicKey,
      };

      updateDelegateAccount(data)(dispatch, getState);

      const accountUpdatedAction = accountUpdated({
        delegate: { account: 'delegate data' },
        isDelegate: true,
      });
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
        network: {
          status: { online: true },
          name: 'Mainnet',
          networks: {
            LSK: {
              nodeUrl: 'hhtp://localhost:4000',
              nethash: '198f2b61a8eb95fbeed58b8216780b68f697f26b849acf00c8c93bb9b24f783d',
            },
          },
        },
        account: {
          info: {
            LSK: {},
          },
        },
        settings: {
          token: {
            active: 'LSK',
          },
        },
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

      const delegateStatsLoadedAction = accountUpdated({
        token: 'LSK',
        delegate: {
          lastBlock: 1,
          txDelegateRegister: { timestamp: 2 },
        },
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
          token: {
            list: {
              LSK: true,
              BTC: true,
            },
          },
        },
      };
    });

    afterEach(() => {
      accountApi.getAccount.mockReset();
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
            LSK: expect.objectContaining({ address, balance }),
            BTC: expect.objectContaining({ address, balance }),
          },
        }),
      }));
    });

    it('should call account api and dispatch accountLoggedIn with ledger loginType', async () => {
      accountApi.getAccount.mockResolvedValue({ balance, address });
      await login({ hwInfo: { deviceModel: 'Ledger Nano S' }, publicKey })(dispatch, getState);
      expect(dispatch).toHaveBeenNthCalledWith(2, expect.objectContaining({
        type: actionTypes.accountLoggedIn,
        data: expect.objectContaining({
          info: {
            LSK: expect.objectContaining({ address, balance }),
            BTC: expect.objectContaining({ address, balance }),
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
