import * as accountApi from '@wallet/utils/api';
import wallets from '@tests/constants/wallets';
import * as networkActions from '@network/store/action';
import { accountDataUpdated } from '@wallet/store/action';
import actionTypes from './actionTypes';
import { secondPassphraseStored, secondPassphraseRemoved } from './action';

jest.mock('i18next', () => ({
  t: jest.fn((key) => key),
  init: jest.fn(),
}));
jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
  },
}));
jest.mock('@wallet/utils/api', () => ({
  getAccount: jest.fn(),
  extractAddress: jest.fn(),
}));
jest.mock('@transaction/store/actions', () => ({
  updateTransactions: jest.fn(),
}));
jest.mock('@network/store/action', () => ({
  networkStatusUpdated: jest.fn(),
}));
jest.mock('@wallet/utils/account', () => ({
  extractKeyPair: jest.fn(),
  getUnlockableUnlockObjects: () => [{}],
}));

describe('actions: account', () => {
  const dispatch = jest.fn();

  beforeEach(() => {
    jest.resetAllMocks();
  });

  afterEach(() => {
    accountApi.getAccount.mockReset();
    networkActions.networkStatusUpdated.mockReset();
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
              nethash: '198f2b61a8eb95fbeed58b8216780b68f697f26b849acf00c8c93bb9b24f783d',
            },
          },
        },
        settings: {
          enableCustomDerivationPath: true,
          customDerivationPath: '1/2',
        },
        token: {
          active: 'LSK',
          list: { LSK: true },
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
});
