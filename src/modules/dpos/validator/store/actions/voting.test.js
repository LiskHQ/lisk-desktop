import loginTypes from '@auth/const/loginTypes';
import networks from '@network/configuration/networks';
import * as transactionApi from '@transaction/api';
import * as accountApi from '@wallet/utils/api';
import * as hwManager from '@transaction/utils/hwManager';
import sampleVotes from '@tests/constants/votes';
import wallets from '@tests/constants/wallets';
import txActionTypes from '@transaction/store/actionTypes';
import * as delegateApi from '../../api';
import actionTypes from './actionTypes';
import {
  voteEdited,
  votesCleared,
  votesSubmitted,
  votesConfirmed,
  votesRetrieved,
  balanceUnlocked,
} from './voting';

jest.mock('@transaction/api', () => ({
  createGenericTx: jest.fn(),
  computeTransactionId: jest.fn(),
}));

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
  const getState = () => ({
    blocks: {
      latestBlocks: [
        { height: 123123124, numberOfTransactions: 2 },
        { height: 123123126, numberOfTransactions: 5 },
        { height: 123123127, numberOfTransactions: 6 },
      ],
    },
    network: {
      name: networks.mainnet.name,
      networks: {
        LSK: {
          serviceUrl: 'http://example.api',
        },
      },
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

  const dispatch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('voteEdited', () => {
    it('should create an action to add data to toggle the vote status for any given delegate', async () => {
      accountApi.getAccount.mockResolvedValue({ data: wallets.genesis });
      const data = [{
        address: 'dummy',
        amount: 1e10,
      }];
      await voteEdited(data)(dispatch, getState);
      expect(accountApi.getAccount).toHaveBeenCalled();
    });

    it('creates an action to add data to toggle the vote status for any given delegate, without calling getAccount', async () => {
      const data = [{
        address: 'dummy',
        amount: 1e10,
        username: 'genesis',
      }];
      await voteEdited(data)(dispatch, getState);
      expect(accountApi.getAccount).not.toHaveBeenCalled();
    });
  });

  describe('votesSubmitted', () => {
    it('should call create transactions', async () => {
      const tx = { data: sampleVotes[0] };
      transactionApi.createGenericTx.mockResolvedValue(tx);
      const data = [{
        address: 'dummy',
        amount: 1e10,
      }];

      await votesSubmitted(data)(dispatch, getState);
      expect(transactionApi.createGenericTx).toHaveBeenCalled();
      expect(hwManager.signTransactionByHW).not.toHaveBeenCalled();
      expect(dispatch).toHaveBeenCalledTimes(3);
      expect(dispatch).toHaveBeenCalledWith({
        type: actionTypes.votesSubmitted,
      });
      expect(dispatch).toHaveBeenCalledWith({
        type: txActionTypes.transactionCreatedSuccess,
        data: tx,
      });
    });

    it('should call create transactions', async () => {
      const tx = { data: sampleVotes[0] };
      loginTypes.passphrase.code = 1;
      const data = [{
        address: 'dummy',
        amount: 1e10,
      }];

      await votesSubmitted(data)(dispatch, getState);
      expect(transactionApi.createGenericTx).toHaveBeenCalled();
      expect(dispatch).toHaveBeenCalledTimes(3);
      expect(dispatch).toHaveBeenCalledWith({
        type: actionTypes.votesSubmitted,
      });
      expect(dispatch).toHaveBeenCalledWith({
        type: txActionTypes.transactionCreatedSuccess,
        data: tx,
      });
    });

    it('dispatches a transactionSignError action if an error occurs', async () => {
      const error = new Error('Error message.');
      transactionApi.createGenericTx.mockRejectedValue(error);
      const data = [{
        address: 'dummy',
        amount: 1e10,
      }];

      await votesSubmitted(data)(dispatch, getState);
      expect(transactionApi.createGenericTx).toHaveBeenCalled();
      expect(dispatch).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenCalledWith({
        type: txActionTypes.transactionSignError,
        data: error,
      });
    });
  });

  describe('votesConfirmed', () => {
    it('should dispatch vote type without data', () => {
      const expectedAction = {
        type: actionTypes.votesConfirmed,
      };

      expect(votesConfirmed()).toEqual(expectedAction);
    });
  });

  describe('votesCleared', () => {
    it('should dispatch vote type without data', () => {
      const expectedAction = {
        type: actionTypes.votesCleared,
      };

      expect(votesCleared()).toEqual(expectedAction);
    });
  });

  describe('votesRetrieved', () => {
    it('should call getVotes and dispatch vote results', async () => {
      const votes = [{ address: 'lskdwsyfmcko6mcd357446yatromr9vzgu7eb8y99', username: 'genesis', amount: 1e8 }];
      const expectedAction = {
        type: actionTypes.votesRetrieved,
        data: votes,
      };
      delegateApi.getVotes.mockImplementation(() => Promise.resolve({ data: votes }));
      await votesRetrieved()(dispatch, getState);

      expect(dispatch).toHaveBeenCalledWith(expectedAction);
    });
  });

  describe('balanceUnlocked', () => {
    const state = getState();
    const activeTokenWallet = {
      hwInfo: undefined,
      loginType: 0,
      passphrase: undefined,
      ...state.wallet.info.LSK,
    };
    const params = {
      moduleAssetId: '5:2',
      sender: { publicKey: wallets.genesis.summary.publicKey },
      nonce: wallets.genesis.sequence.nonce,
      fee: '10000000',
      asset: {
        unlockObjects: [],
      },
    };

    it('should dispatch transactionCreatedSuccess', async () => {
      const tx = { id: 1 };
      transactionApi.createGenericTx.mockImplementation(() =>
        new Promise((resolve) => {
          resolve(tx);
        }));
      await balanceUnlocked(params)(dispatch, getState);
      expect(transactionApi.createGenericTx).toHaveBeenCalledWith({
        network: state.network,
        wallet: activeTokenWallet,
        transactionObject: params,
      });
      expect(dispatch).toHaveBeenCalledWith({
        type: txActionTypes.transactionCreatedSuccess,
        data: tx,
      });
    });

    it('should dispatch transactionSignError', async () => {
      const error = { message: 'TestError' };
      transactionApi.createGenericTx.mockImplementation(() =>
        new Promise((_, reject) => {
          reject(error);
        }));
      await balanceUnlocked(params)(dispatch, getState);
      expect(dispatch).toHaveBeenCalledWith({
        type: txActionTypes.transactionSignError,
        data: error,
      });
    });
  });
});
