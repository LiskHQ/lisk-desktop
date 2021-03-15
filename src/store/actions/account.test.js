import { toast } from 'react-toastify';
import { actionTypes } from '@constants';
import {
  accountLoggedOut,
  accountDataUpdated,
  login,
} from './account';
import * as accountApi from '../../utils/api/account';
import accounts from '../../../test/constants/accounts';
import * as networkActions from './network';

jest.mock('i18next', () => ({
  t: jest.fn(key => key),
  init: jest.fn(),
}));
jest.mock('../utils/api/account', () => ({
  getAccount: jest.fn(),
}));
jest.mock('./transactions', () => ({
  updateTransactions: jest.fn(),
}));
jest.mock('./network', () => ({
  networkStatusUpdated: jest.fn(),
}));

const network = {
  name: 'Mainnet',
  networks: {
    LSK: {},
    BTC: {},
  },
};

describe('actions: account', () => {
  const dispatch = jest.fn();

  beforeEach(() => {
    jest.resetAllMocks();
  });

  afterEach(() => {
    accountApi.getAccount.mockReset();
    networkActions.networkStatusUpdated.mockReset();
  });

  describe('accountLoggedOut', () => {
    it('should create an action to reset the account', () => {
      const expectedAction = {
        type: actionTypes.accountLoggedOut,
      };

      expect(accountLoggedOut()).toEqual(expectedAction);
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
          list: [
            { LSK: true },
            { BTC: false },
          ],
        },
        account: {
          passphrase: accounts.genesis.passphrase,
          info: {
            LSK: {
              address: accounts.genesis.address,
              publicKey: accounts.genesis.publicKey,
              balance: 0,
            },
          },
        },
      });
    });

    it('should call account API methods on newBlockCreated action when online', async () => {
      accountApi.getAccount.mockResolvedValue({ balance: 10e8 });

      await accountDataUpdated('active')(dispatch, getState);
      expect(dispatch).toHaveBeenCalledTimes(2);
      expect(networkActions.networkStatusUpdated).toHaveBeenCalledWith({ online: true });
    });

    it('should call account API methods on newBlockCreated action when offline', async () => {
      const code = 'EUNAVAILABLE';
      accountApi.getAccount.mockRejectedValue({ error: { code } });

      await accountDataUpdated('active')(dispatch, getState);
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
        network,
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
      await login({ passphrase })(dispatch, getState);
      expect(dispatch).toHaveBeenNthCalledWith(1, expect.objectContaining({
        type: actionTypes.accountLoading,
      }));

      expect(dispatch).toHaveBeenNthCalledWith(2, expect.objectContaining({
        type: actionTypes.accountLoggedIn,
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

    it.skip('should fire an error toast if getAccount fails ', async () => {
      jest.spyOn(toast, 'error');
      accountApi.getAccount.mockRejectedValue({ message: 'custom error' });
      await login({ passphrase })(dispatch, getState);
      expect(toast.error).toHaveBeenNthCalledWith(1, 'Unable to connect to the node, no response from the server.');
    });
  });
});
