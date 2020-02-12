import { toast } from 'react-toastify';
import actionTypes from '../constants/actions';
import {
  accountUpdated,
  accountLoggedOut,
  secondPassphraseRegistered,
  removePassphrase,
  accountDataUpdated,
  updateEnabledTokenAccount,
  login,
} from './account';
import * as accountApi from '../utils/api/account';
import Fees from '../constants/fees';
import transactionTypes from '../constants/transactionTypes';
import networks from '../constants/networks';
import accounts from '../../test/constants/accounts';
import * as networkActions from './network';

jest.mock('i18next', () => ({
  t: jest.fn(key => key),
  init: jest.fn(),
}));
jest.mock('../utils/api/account', () => ({
  getAccount: jest.fn(),
  setSecondPassphrase: jest.fn(),
}));
jest.mock('./transactions', () => ({
  updateTransactions: jest.fn(),
}));
jest.mock('./network', () => ({
  networkStatusUpdated: jest.fn(),
}));

describe('actions: account', () => {
  let dispatch;

  beforeEach(() => {
    dispatch = jest.fn();
  });

  afterEach(() => {
    accountApi.getAccount.mockReset();
    accountApi.setSecondPassphrase.mockReset();
    networkActions.networkStatusUpdated.mockReset();
  });

  describe('accountUpdated', () => {
    it('should create an action to set values to account', () => {
      const data = {
        passphrase: 'robust swift grocery peasant forget share enable convince deputy road keep cheap',
      };

      const expectedAction = {
        data,
        type: actionTypes.accountUpdated,
      };
      expect(accountUpdated(data)).toEqual(expectedAction);
    });
  });

  describe('accountLoggedOut', () => {
    it('should create an action to reset the account', () => {
      const expectedAction = {
        type: actionTypes.accountLoggedOut,
      };

      expect(accountLoggedOut()).toEqual(expectedAction);
    });
  });

  // TODO remove this test when the action is removed
  describe.skip('secondPassphraseRegistered', () => {
    const data = {
      passphrase: accounts.second_passphrase_account.passphrase,
      secondPassphrase: accounts.second_passphrase_account.secondPassphrase,
      account: accounts.second_passphrase_account,
      callback: jest.fn(),
    };
    const actionFunction = secondPassphraseRegistered(data);
    let getState;

    beforeEach(() => {
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

    it('should dispatch addNewPendingTransaction action if resolved', () => {
      const transaction = {
        id: '15626650747375562521',
        senderPublicKey: accounts.second_passphrase_account.publicKey,
        senderId: accounts.second_passphrase_account.address,
        amount: 0,
        fee: Fees.setSecondPassphrase,
        type: transactionTypes().setSecondPassphrase.code,
        token: 'LSK',
      };
      accountApi.setSecondPassphrase.mockResolvedValue(transaction);

      actionFunction(dispatch, getState);
      expect(dispatch).toHaveBeenCalledWith({
        data: transaction, type: actionTypes.addNewPendingTransaction,
      });
      expect(data.callback).toHaveBeenCalledWith({
        success: true,
        transaction,
      });
    });

    it('should call callback if api call fails', () => {
      const error = { message: 'sample message' };
      accountApi.setSecondPassphrase.mockRejectedValue(error);

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

      expect(removePassphrase(data)).toEqual(expectedAction);
    });
  });

  describe('accountDataUpdated', () => {
    let getState;

    beforeEach(() => {
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

    it(`should call account API methods on ${actionTypes.newBlockCreated} action when online`, async () => {
      accountApi.getAccount.mockResolvedValue({ balance: 10e8 });

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

      await accountDataUpdated(data)(dispatch, getState);
      expect(dispatch).toHaveBeenCalledTimes(2);
      expect(networkActions.networkStatusUpdated).toHaveBeenCalledWith({ online: true });
    });

    it(`should call account API methods on ${actionTypes.newBlockCreated} action when offline`, async () => {
      const code = 'EUNAVAILABLE';
      accountApi.getAccount.mockRejectedValue({ error: { code } });

      const data = {
        windowIsFocused: true,
        transactions: {
          pending: [{ id: 12498250891724098 }],
          confirmed: [],
          account: { address: accounts.second_passphrase_account.address, balance: 0 },
        },
        account: { address: accounts.genesis.address },
      };

      await accountDataUpdated(data)(dispatch, getState);
      expect(networkActions.networkStatusUpdated).toHaveBeenCalledWith({
        online: false, code,
      });
    });
  });

  describe('login', () => {
    let state;
    const getState = () => (state);
    const balance = 10e8;
    const { passphrase, address, publicKey } = accounts.genesis;

    beforeEach(() => {
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

    it('should fire an error toast if getAccount fails ', async () => {
      jest.spyOn(toast, 'error');
      accountApi.getAccount.mockRejectedValue({ error: 'custom error' });
      await login({ passphrase })(dispatch, getState);
      expect(toast.error).toHaveBeenNthCalledWith(1, 'Unable to connect to the node, no response from the server.');
    });
  });

  describe('updateEnabledTokenAccount', () => {
    let state;
    const getState = () => (state);
    const {
      address,
      balance,
      passphrase,
    } = accounts.genesis;

    beforeEach(() => {
      state = {
        account: {
          passphrase,
        },
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

    it('should call account api and dispatch accountUpdated ', async () => {
      accountApi.getAccount.mockResolvedValue({ balance, address });
      await updateEnabledTokenAccount('BTC')(dispatch, getState);
      expect(dispatch).toHaveBeenCalledWith({
        type: actionTypes.accountUpdated,
        data: expect.objectContaining({ address, balance }),
      });
    });

    it('should fire an error toast if getAccount fails ', async () => {
      jest.spyOn(toast, 'error');
      accountApi.getAccount.mockRejectedValue({ error: 'custom error' });
      await updateEnabledTokenAccount('BTC')(dispatch, getState);
      expect(toast.error).toHaveBeenCalled();
    });
  });
});
