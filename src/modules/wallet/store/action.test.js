import * as accountApi from '@wallet/utils/api';
import { signTransaction } from '@transaction/api';
import wallets from '@tests/constants/wallets';
import moduleCommandSchemas from '@tests/constants/schemas';
import * as networkActions from '@network/store/action';
import txActionTypes from '@transaction/store/actionTypes';
import loginTypes from 'src/modules/auth/const/loginTypes';
import { accountDataUpdated, multisigGroupRegistered } from './action';

jest.mock('i18next', () => ({
  t: jest.fn((key) => key),
  init: jest.fn(),
}));
jest.mock('@wallet/utils/api', () => ({
  getAccount: jest.fn(),
}));
jest.mock('@network/store/action', () => ({
  networkStatusUpdated: jest.fn(),
}));
jest.mock('@transaction/api');

describe('actions: account', () => {
  const dispatch = jest.fn();

  beforeEach(() => {
    jest.resetAllMocks();
  });

  afterEach(() => {
    accountApi.getAccount.mockReset();
    networkActions.networkStatusUpdated.mockReset();
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
              moduleCommandSchemas,
            },
          },
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

  describe.skip('multisigGroupRegistered', () => {
    const state = {
      wallet: {
        loginType: loginTypes.passphrase.code,
        // passphrase: wallets.multiSig_candidate.passphrase,
        info: {
          LSK: wallets.multiSig_candidate,
        },
      },
      network: {
        name: 'Mainnet',
        networks: {
          LSK: {
            serviceUrl: 'http://localhost:4000',
            nethash: '198f2b61a8eb95fbeed58b8216780b68f697f26b849acf00c8c93bb9b24f783d',
            moduleCommandSchemas,
          },
        },
      },
      token: {
        active: 'LSK',
      },
      hwInfo: {},
    };
    const getState = () => state;
    const params = {
      fee: 10000000,
      mandatoryKeys: ['1'],
      optionalKeys: ['2', '3'],
      numberOfSignatures: 2,
    };

    const transactionJSON = {
      fee: 10000000,
      module: 'auth',
      command: 'registerMultisignature',
      sender: {
        publicKey: '1',
      },
      params: {
        mandatoryKeys: ['1'],
        optionalKeys: ['2', '3'],
        numberOfSignatures: 2,
        signatures: [],
      },
    };
    const privateKey = '0x0';

    it('should dispatch transactionCreatedSuccess', async () => {
      const tx = { id: 1 };
      signTransaction.mockImplementation(
        () =>
          new Promise((resolve) => {
            resolve(tx);
          })
      );
      await multisigGroupRegistered({}, transactionJSON, privateKey)(dispatch, getState);
      expect(signTransaction).toHaveBeenCalledWith({
        transactionJSON,
        wallet: {
          ...state.wallet.info.LSK,
          hwInfo: state.hwInfo,
          loginType: state.wallet.loginType,
        },
        schema: state.network.networks.LSK.moduleCommandSchemas[transactionJSON.moduleCommand],
        chainID: state.network.networks.LSK.chainID,
        privateKey,
      });
      expect(dispatch).toHaveBeenCalledWith({
        type: txActionTypes.transactionCreatedSuccess,
        data: tx,
      });
    });

    it('should dispatch transactionSignError', async () => {
      const error = { message: 'TestError' };
      signTransaction.mockImplementation(
        () =>
          new Promise((_, reject) => {
            reject(error);
          })
      );
      await multisigGroupRegistered(params)(dispatch, getState);
      expect(dispatch).toHaveBeenCalledWith({
        type: txActionTypes.transactionSignError,
        data: error,
      });
    });
  });
});
