import loginTypes from '@auth/const/loginTypes';
import networks from '@network/configuration/networks';
import * as transactionApi from '@transaction/api';
import * as accountApi from '@wallet/utils/api';
import * as hwManager from '@transaction/utils/hwManager';
import sampleStakes from '@tests/constants/stakes';
import wallets from '@tests/constants/wallets';
import txActionTypes from '@transaction/store/actionTypes';
import mockSavedAccounts from '@tests/fixtures/accounts';
import { mockCommandParametersSchemas } from 'src/modules/common/__fixtures__';
import * as validatorApi from '../../api';
import actionTypes from './actionTypes';
import {
  stakeEdited,
  stakesCleared,
  stakesSubmitted,
  stakesConfirmed,
  stakesRetrieved,
  balanceUnlocked,
} from './staking';

jest.mock('@transaction/api');

jest.mock('../../api', () => ({
  getVotes: jest.fn(),
}));

jest.mock('@wallet/utils/api', () => ({
  getAccount: jest.fn(),
}));

jest.mock('@transaction/utils/hwManager', () => ({
  signTransactionByHW: jest.fn(),
}));

describe('actions: voting', () => {
  const moduleCommandSchemas = mockCommandParametersSchemas.data.reduce(
    (result, { moduleCommand, schema }) => ({ ...result, [moduleCommand]: schema }),
    {}
  );

  const getState = () => ({
    network: {
      name: networks.mainnet.label,
      networks: {
        LSK: {
          serviceUrl: 'http://example.api',
          moduleCommandSchemas,
        },
      },
    },
    account: {
      current: mockSavedAccounts[0],
    },
    wallet: {
      loginType: 0,
      info: {
        LSK: {
          summary: {
            address: '123L',
            publicKey: '0fe9a3f1a21b5530f27f87a414b549e79a940bf24fdf2b2f05e7f22aeeecc86a',
          },
          sequence: {
            nonce: '1',
          },
          votes: [{ delegateAddress: '123L', amount: 1e9 }],
        },
      },
    },
    token: {
      active: 'LSK',
    },
  });

  const privateKey = '0x0';

  const transactionJSON = {
    module: 'dpos',
    command: 'voteDelegate',
    nonce: '6',
    senderPublicKey: 'c094ebee7ec0c50ebee32918655e089f6e1a604b83bcaa760293c61e0f18ab6f',
    signatures: [],
    fee: '0',
    params: {
      votes: [
        {
          delegateAddress: 'lskz5kf62627u2n8kzqa8jpycee64pgxzutcrbzhz',
          amount: 1e10,
        },
      ],
    },
  };

  const dispatch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('stakeEdited', () => {
    it('should create an action to add data to toggle the stake status for any given delegate', async () => {
      const data = [
        {
          delegateAddress: 'dummy',
          amount: 1e10,
        },
      ];
      await stakeEdited(data)(dispatch);
      expect(dispatch).toHaveBeenCalledWith({
        type: actionTypes.stakeEdited,
        data,
      });
    });

    it('creates an action to add data to toggle the stake status for any given delegate, without calling getAccount', async () => {
      const data = [
        {
          address: 'dummy',
          amount: 1e10,
          username: 'genesis',
        },
      ];
      await stakeEdited(data)(dispatch);
      expect(accountApi.getAccount).not.toHaveBeenCalled();
    });
  });

  describe('stakesSubmitted', () => {
    it('should call create transactions', async () => {
      const tx = { data: sampleStakes[0] };
      transactionApi.signTransaction.mockResolvedValue(tx);
      const data = [
        {
          address: 'dummy',
          amount: 1e10,
        },
      ];
      const senderAccount = {
        mandatoryKeys: [],
        optionalKeys: [],
      };

      await stakesSubmitted(
        data,
        transactionJSON,
        privateKey,
        '',
        senderAccount,
        moduleCommandSchemas
      )(dispatch, getState);
      expect(transactionApi.signTransaction).toHaveBeenCalled();
      expect(hwManager.signTransactionByHW).not.toHaveBeenCalled();
      expect(dispatch).toHaveBeenCalledTimes(2);
      expect(dispatch).toHaveBeenCalledWith({
        type: actionTypes.stakesSubmitted,
      });
      expect(dispatch).toHaveBeenCalledWith({
        type: txActionTypes.transactionCreatedSuccess,
        data: tx,
      });
    });

    it('should call create transactions', async () => {
      const tx = { data: sampleStakes[0] };
      loginTypes.passphrase.code = 1;
      const data = [
        {
          address: 'dummy',
          amount: 1e10,
        },
      ];
      const senderAccount = {
        mandatoryKeys: [],
        optionalKeys: [],
      };

      await stakesSubmitted(
        data,
        transactionJSON,
        privateKey,
        '',
        senderAccount,
        moduleCommandSchemas
      )(dispatch, getState);

      expect(transactionApi.signTransaction).toHaveBeenCalled();
      expect(dispatch).toHaveBeenCalledTimes(2);
      expect(dispatch).toHaveBeenCalledWith({
        type: actionTypes.stakesSubmitted,
      });
      expect(dispatch).toHaveBeenCalledWith({
        type: txActionTypes.transactionCreatedSuccess,
        data: tx,
      });
    });

    it('dispatches a transactionSignError action if an error occurs', async () => {
      const error = new Error('Error message.');
      transactionApi.signTransaction.mockRejectedValue(error);
      const data = [
        {
          address: 'dummy',
          amount: 1e10,
        },
      ];
      const senderAccount = {
        mandatoryKeys: [],
        optionalKeys: [],
      };

      await stakesSubmitted(
        data,
        transactionJSON,
        privateKey,
        '',
        senderAccount,
        moduleCommandSchemas
      )(dispatch, getState);

      expect(transactionApi.signTransaction).toHaveBeenCalled();
      expect(dispatch).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenCalledWith({
        type: txActionTypes.transactionSignError,
        data: error,
      });
    });
  });

  describe('stakesConfirmed', () => {
    it('should dispatch stake type without data', () => {
      const expectedAction = {
        type: actionTypes.stakesConfirmed,
      };

      expect(stakesConfirmed()).toEqual(expectedAction);
    });
  });

  describe('stakesCleared', () => {
    it('should dispatch stake type without data', () => {
      const expectedAction = {
        type: actionTypes.stakesCleared,
      };

      expect(stakesCleared()).toEqual(expectedAction);
    });
  });

  describe('stakesRetrieved', () => {
    it('should call getVotes and dispatch stake results', async () => {
      const votes = [
        { address: 'lskdwsyfmcko6mcd357446yatromr9vzgu7eb8y99', username: 'genesis', amount: 1e8 },
      ];
      const expectedAction = {
        type: actionTypes.stakesRetrieved,
        data: votes,
      };
      validatorApi.getVotes.mockImplementation(() => Promise.resolve({ data: votes }));
      await stakesRetrieved()(dispatch, getState);

      expect(dispatch).toHaveBeenCalledWith(expectedAction);
    });
  });

  describe('balanceUnlocked', () => {
    const state = getState();
    const activeTokenWallet = {
      hwInfo: undefined,
      loginType: 0,
      ...state.wallet.info.LSK,
    };
    const transactionObject = {
      module: 'dpos',
      command: 'unlock',
      sender: { publicKey: wallets.genesis.summary.publicKey },
      nonce: wallets.genesis.sequence.nonce,
      fee: '10000000',
      params: {
        unlockObjects: [],
      },
      moduleCommand: 'dpos:unlock',
    };

    it('should dispatch transactionCreatedSuccess', async () => {
      const tx = { id: 1 };
      transactionApi.signTransaction.mockImplementation(
        () =>
          new Promise((resolve) => {
            resolve(tx);
          })
      );
      await balanceUnlocked(
        { moduleCommand: 'dpos:unlock' },
        transactionObject,
        privateKey
      )(dispatch, getState);
      expect(transactionApi.signTransaction).toHaveBeenCalledWith({
        wallet: activeTokenWallet,
        schema: state.network.networks.LSK.moduleCommandSchemas[transactionObject.moduleCommand],
        chainID: state.network.networks.LSK.chainID,
        transactionJSON: transactionObject,
        privateKey,
      });
      expect(dispatch).toHaveBeenCalledWith({
        type: txActionTypes.transactionCreatedSuccess,
        data: tx,
      });
    });

    it('should dispatch transactionSignError', async () => {
      const error = { message: 'TestError' };
      transactionApi.signTransaction.mockImplementation(
        () =>
          new Promise((_, reject) => {
            reject(error);
          })
      );
      await balanceUnlocked(transactionObject, privateKey)(dispatch, getState);
      expect(dispatch).toHaveBeenCalledWith({
        type: txActionTypes.transactionSignError,
        data: error,
      });
    });
  });
});
