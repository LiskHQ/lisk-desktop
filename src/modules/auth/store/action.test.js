/* eslint-disable max-lines */
import { toast } from 'react-toastify';
import * as accountApi from '@wallet/utils/api';
import { extractKeyPair } from '@wallet/utils/account';
import { defaultDerivationPath } from '@common/utilities/explicitBipKeyDerivation';
import wallets from '@tests/constants/wallets';
import * as networkActions from '@network/store/action';
import { accountDataUpdated } from '@wallet/store/action';
import actionTypes from './actionTypes';
import {
  accountLoggedOut,
  login,
  secondPassphraseStored,
  secondPassphraseRemoved,
} from './action';

jest.mock('i18next', () => ({
  t: jest.fn((key) => key),
  init: jest.fn(),
}));
jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
  },
}));
jest.mock('@wallet/utilities/api', () => ({
  getAccount: jest.fn(),
  extractAddress: jest.fn(),
}));
jest.mock('@transaction/store/actions', () => ({
  updateTransactions: jest.fn(),
}));
jest.mock('@network/store/action', () => ({
  networkStatusUpdated: jest.fn(),
}));
jest.mock('@wallet/utilities/account', () => ({
  extractKeyPair: jest.fn(),
  getUnlockableUnlockObjects: () => [{}],
}));

const network = {
  name: 'Mainnet',
  networks: {
    LSK: {},
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

  describe('secondPassphraseStored', () => {
    it('should create an action to reset the account', () => {
      const expectedAction = {
        type: actionTypes.secondPassphraseStored,
      };

      expect(secondPassphraseStored()).toEqual(expectedAction);
    });
  });

  describe('secondPassphraseRemoved', () => {
    it('should create an action to reset the account', () => {
      const expectedAction = {
        type: actionTypes.secondPassphraseRemoved,
      };

      expect(secondPassphraseRemoved()).toEqual(expectedAction);
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
              serviceUrl: 'http://localhost:4000',
              nethash:
                '198f2b61a8eb95fbeed58b8216780b68f697f26b849acf00c8c93bb9b24f783d',
            },
          },
        },
        settings: {
          token: {
            active: 'LSK',
            list: { LSK: true },
          },
        },
        wallet: {
          passphrase: wallets.genesis.passphrase,
          info: {
            LSK: {
              summary: {
                address: wallets.genesis.summary.address,
                publicKey: wallets.genesis.summary.publicKey,
                balance: 0,
              },
            },
          },
        },
      });
    });

    it('should call account API methods on newBlockCreated action when online', async () => {
      accountApi.getAccount.mockResolvedValue({
        summary: {
          address: wallets.genesis.summary.address,
          publicKey: wallets.genesis.summary.publicKey,
          balance: 10e8,
        },
        token: {
          balance: 10e8,
        },
      });

      await accountDataUpdated('active')(dispatch, getState);
      expect(dispatch).toHaveBeenCalledTimes(2);
      expect(networkActions.networkStatusUpdated).toHaveBeenCalledWith({
        online: true,
      });
    });

    it('should call account API methods on newBlockCreated action when offline', async () => {
      const code = 'EN_AVAILABLE';
      accountApi.getAccount.mockRejectedValue({ error: { code } });

      await accountDataUpdated('active')(dispatch, getState);
      expect(networkActions.networkStatusUpdated).toHaveBeenCalledWith({
        online: false,
        code,
      });
    });

    it('gets the active token from the token list in settings when token types is enabled', async () => {
      accountApi.getAccount.mockResolvedValue({
        summary: {
          address: wallets.genesis.summary.address,
          publicKey: wallets.genesis.summary.publicKey,
          balance: 10e8,
        },
        token: {
          balance: 10e8,
        },
      });

      await accountDataUpdated('enabled')(dispatch, getState);
      expect(networkActions.networkStatusUpdated).toHaveBeenCalledWith({
        online: true,
      });
    });
  });

  describe('login', () => {
    let state;
    const getState = () => state;
    const balance = 10e8;
    const {
      passphrase,
      summary: { address, publicKey },
    } = wallets.genesis;

    beforeEach(() => {
      state = {
        network,
        settings: {
          autoLog: true,
          token: {
            list: {
              LSK: true,
            },
          },
          enableCustomDerivationPath: true,
          customDerivationPath: '1/2',
        },
      };
    });

    it('should call account api and dispatch accountLoggedIn', async () => {
      await login({ passphrase })(dispatch, getState);
      expect(dispatch).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          type: actionTypes.accountLoading,
        }),
      );

      expect(dispatch).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({
          type: actionTypes.accountLoggedIn,
        }),
      );
    });

    it('should call account api and dispatch accountLoggedIn with ledger loginType', async () => {
      accountApi.getAccount.mockResolvedValue({ balance, address });
      await login({ hwInfo: { deviceModel: 'Ledger Nano S' }, publicKey })(
        dispatch,
        getState,
      );
      expect(dispatch).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({
          type: actionTypes.accountLoggedIn,
          data: expect.objectContaining({
            info: {
              LSK: expect.objectContaining({ address, balance }),
            },
          }),
        }),
      );
    });

    it('should call extractPublicKey with params', async () => {
      accountApi.getAccount.mockResolvedValue({ balance, address });
      await login({ passphrase })(dispatch, getState);
      expect(extractKeyPair).toHaveBeenCalledWith({ passphrase, enableCustomDerivationPath: true, derivationPath: '1/2' });

      const newGetState = () => ({
        ...state,
        settings: {
          ...state.settings,
          enableCustomDerivationPath: false,
          customDerivationPath: undefined,
        },
      });

      await login({ passphrase })(dispatch, newGetState);
      expect(extractKeyPair).toHaveBeenLastCalledWith({
        passphrase, enableCustomDerivationPath: false, derivationPath: defaultDerivationPath,
      });
    });

    it('should fire an error toast if getAccount fails ', async () => {
      jest.spyOn(toast, 'error');
      accountApi.getAccount.mockRejectedValue({ message: 'custom error' });
      await login({ passphrase })(dispatch, getState);
      expect(toast.error).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenCalledWith({ type: actionTypes.accountLoggedOut });
    });
  });
});
