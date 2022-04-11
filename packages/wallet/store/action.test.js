/* eslint-disable max-lines */
import { toast } from 'react-toastify';
import { actionTypes } from '@common/configuration';
import * as accountApi from '@wallet/utilities/api';
import { extractKeyPair } from '@wallet/utilities/account';
import { create } from '@transaction/utilities/api';
import { defaultDerivationPath } from '@common/utilities/explicitBipKeyDerivation';
import accounts from '@tests/constants/accounts';
import * as networkActions from '@network/store/action';
import {
  accountLoggedOut,
  accountDataUpdated,
  login,
  secondPassphraseStored,
  secondPassphraseRemoved,
  balanceUnlocked,
  delegateRegistered,
  multisigGroupRegistered,
  balanceReclaimed,
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
jest.mock('@transaction/store/action', () => ({
  updateTransactions: jest.fn(),
}));
jest.mock('@network/store/action', () => ({
  networkStatusUpdated: jest.fn(),
}));
jest.mock('@wallet/utilities/account', () => ({
  extractKeyPair: jest.fn(),
  getUnlockableUnlockObjects: () => [{}],
}));
jest.mock('@transaction/utilities/api');

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
        account: {
          passphrase: accounts.genesis.passphrase,
          info: {
            LSK: {
              summary: {
                address: accounts.genesis.summary.address,
                publicKey: accounts.genesis.summary.publicKey,
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
          address: accounts.genesis.summary.address,
          publicKey: accounts.genesis.summary.publicKey,
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
          address: accounts.genesis.summary.address,
          publicKey: accounts.genesis.summary.publicKey,
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
    } = accounts.genesis;

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

  describe('balanceUnlocked', () => {
    const state = {
      account: {
        passphrase: accounts.genesis.passphrase,
        info: {
          LSK: accounts.genesis,
        },
      },
      network: {},
      blocks: {
        latestBlocks: [{ height: 10 }],
      },
    };
    const getState = () => state;
    const params = { selectedFee: '0.1' };

    it('should dispatch transactionCreatedSuccess', async () => {
      const tx = { id: 1 };
      create.mockImplementation(() =>
        new Promise((resolve) => {
          resolve(tx);
        }));
      await balanceUnlocked(params)(dispatch, getState);
      expect(create).toHaveBeenCalledWith({
        network: state.network,
        account: state.wallet.info.LSK,
        transactionObject: {
          moduleAssetId: '5:2',
          senderPublicKey: accounts.genesis.summary.publicKey,
          nonce: accounts.genesis.sequence?.nonce,
          fee: '10000000',
          unlockObjects: [{}],
        },
      }, 'LSK');
      expect(dispatch).toHaveBeenCalledWith({
        type: actionTypes.transactionCreatedSuccess,
        data: tx,
      });
    });

    it('should dispatch transactionSignError', async () => {
      const error = { message: 'TestError' };
      create.mockImplementation(() =>
        new Promise((_, reject) => {
          reject(error);
        }));
      await balanceUnlocked(params)(dispatch, getState);
      expect(dispatch).toHaveBeenCalledWith({
        type: actionTypes.transactionSignError,
        data: error,
      });
    });
  });

  describe('delegateRegistered', () => {
    const state = {
      account: {
        passphrase: accounts.delegate_candidate.passphrase,
        info: {
          LSK: accounts.delegate_candidate,
        },
      },
      network: {},
    };
    const getState = () => state;
    const params = {
      fee: { value: '0.1' },
      username: 'new_delegate',
    };

    it('should dispatch transactionCreatedSuccess', async () => {
      const tx = { id: 1 };
      create.mockImplementation(() =>
        new Promise((resolve) => {
          resolve(tx);
        }));
      await delegateRegistered(params)(dispatch, getState);
      expect(create).toHaveBeenCalledWith({
        network: state.network,
        account: state.wallet.info.LSK,
        transactionObject: {
          senderPublicKey: accounts.delegate_candidate.summary.publicKey,
          nonce: accounts.delegate_candidate.sequence.nonce,
          fee: 10000000,
          username: params.username,
          moduleAssetId: '5:0',
        },
      }, 'LSK');
      expect(dispatch).toHaveBeenCalledWith({
        type: actionTypes.transactionCreatedSuccess,
        data: tx,
      });
    });

    it('should dispatch transactionSignError', async () => {
      const error = { message: 'TestError' };
      create.mockImplementation(() =>
        new Promise((_, reject) => {
          reject(error);
        }));
      await delegateRegistered(params)(dispatch, getState);
      expect(dispatch).toHaveBeenCalledWith({
        type: actionTypes.transactionSignError,
        data: error,
      });
    });
  });

  describe('multisigGroupRegistered', () => {
    const state = {
      account: {
        passphrase: accounts.multiSig_candidate.passphrase,
        info: {
          LSK: accounts.multiSig_candidate,
        },
      },
      network: {},
    };
    const getState = () => state;
    const params = {
      fee: '0.1',
      mandatoryKeys: ['1'],
      optionalKeys: ['2', '3'],
      numberOfSignatures: 2,
    };

    it('should dispatch transactionCreatedSuccess', async () => {
      const tx = { id: 1 };
      create.mockImplementation(() =>
        new Promise((resolve) => {
          resolve(tx);
        }));
      await multisigGroupRegistered(params)(dispatch, getState);
      expect(create).toHaveBeenCalledWith({
        network: state.network,
        account: state.wallet.info.LSK,
        transactionObject: {
          moduleAssetId: '4:0',
          fee: 10000000,
          mandatoryKeys: params.mandatoryKeys,
          optionalKeys: params.optionalKeys,
          numberOfSignatures: params.numberOfSignatures,
          nonce: accounts.multiSig_candidate.sequence.nonce,
          senderPublicKey: accounts.multiSig_candidate.summary.publicKey,
        },
      }, 'LSK');
      expect(dispatch).toHaveBeenCalledWith({
        type: actionTypes.transactionCreatedSuccess,
        data: tx,
      });
    });

    it('should dispatch transactionSignError', async () => {
      const error = { message: 'TestError' };
      create.mockImplementation(() =>
        new Promise((_, reject) => {
          reject(error);
        }));
      await multisigGroupRegistered(params)(dispatch, getState);
      expect(dispatch).toHaveBeenCalledWith({
        type: actionTypes.transactionSignError,
        data: error,
      });
    });
  });

  describe('balanceReclaimed', () => {
    const state = {
      account: {
        passphrase: accounts.non_migrated.passphrase,
        info: {
          LSK: accounts.non_migrated,
        },
      },
      network: {},
    };
    const getState = () => state;

    it('should dispatch transactionCreatedSuccess', async () => {
      const tx = { id: 1 };
      create.mockImplementation(() =>
        new Promise((resolve) => {
          resolve(tx);
        }));
      await balanceReclaimed({ fee: { value: '0,1' } })(dispatch, getState);
      expect(create).toHaveBeenCalledWith({
        network: state.network,
        account: state.wallet.info.LSK,
        transactionObject: {
          moduleAssetId: '1000:0',
          fee: 100000000,
          amount: '13600000000',
          keys: { numberOfSignatures: 0 },
        },
      }, 'LSK');
      expect(dispatch).toHaveBeenCalledWith({
        type: actionTypes.transactionCreatedSuccess,
        data: tx,
      });
    });

    it('should dispatch transactionSignError', async () => {
      const error = { message: 'TestError' };
      create.mockImplementation(() =>
        new Promise((_, reject) => {
          reject(error);
        }));
      await balanceReclaimed({ fee: { value: '0,1' } })(dispatch, getState);
      expect(dispatch).toHaveBeenCalledWith({
        type: actionTypes.transactionSignError,
        data: error,
      });
    });
  });
});
