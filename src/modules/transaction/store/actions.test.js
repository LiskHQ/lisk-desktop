import { cryptography } from '@liskhq/lisk-client';
import httpApi from 'src/utils/api/http';
import * as transactionUtils from '@transaction/utils/transaction';
import { getState } from '@tests/fixtures/transactions';
import { sampleTransaction } from '@tests/constants/transactions';
import accounts from '@tests/constants/wallets';
import commonActionTypes from 'src/modules/common/store/actionTypes';
import { getAddressFromBase32Address } from '@wallet/utils/account';
import actionTypes from './actionTypes';
import {
  emptyTransactionsData,
  transactionsRetrieved,
  resetTransactionResult,
  pendingTransactionAdded,
  transactionDoubleSigned,
  transactionBroadcasted,
  multisigTransactionSigned,
  signatureSkipped,
} from './actions';

const address = 'lskdxc4ta5j43jp9ro3f8zqbxta9fn6jwzjucw7yt';
jest.spyOn(cryptography.address, 'getLisk32AddressFromPublicKey').mockReturnValue(address);
jest.mock('@pos/validator/api');
jest.mock('src/utils/api/http');

// TODO: All of these tests need to be rewritten to adopt to new transaction schema https://github.com/LiskHQ/lisk-sdk/blob/7e71617d281649a6942434f729a815870aac2394/elements/lisk-transactions/src/schema.ts#L15
// We need to avoid lot of back and forth convertion from JSON and JS object
// For consistency we will adopt these changes similar to https://github.com/LiskHQ/lisk-sdk/blob/development/elements/lisk-api-client/src/transaction.ts
// We will address of these problem in issue https://github.com/LiskHQ/lisk-desktop/issues/4400

describe.skip('actions: transactions', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  const dispatch = jest.fn();

  describe('getTransactions', () => {
    const data = {
      address: 'lsks6uckwnap7s72ov3edddwgxab5e89t6uy8gjt6',
      limit: 20,
      offset: 0,
      filters: {},
    };

    it('should create an action function', () => {
      expect(typeof transactionsRetrieved(data)).toBe('function');
    });

    it('should dispatch getTransactionsSuccess action if resolved', async () => {
      // Arrange
      httpApi.mockResolvedValue({ data: [], meta: { total: 0 } });
      const expectedAction = {
        count: 0,
        confirmed: [],
        address: data.address,
        filters: data.filters,
        offset: 0,
      };

      // Act
      await transactionsRetrieved(data)(dispatch, getState);

      // Assert
      expect(dispatch).toHaveBeenNthCalledWith(1, {
        type: commonActionTypes.loadingStarted,
        data: actionTypes.transactionsRetrieved,
      });
      expect(dispatch).toHaveBeenNthCalledWith(2, {
        type: actionTypes.transactionsRetrieved,
        data: expectedAction,
      });
      expect(dispatch).toHaveBeenNthCalledWith(3, {
        type: commonActionTypes.loadingFinished,
        data: actionTypes.transactionsRetrieved,
      });
    });

    it('should dispatch getTransactionsSuccess action if resolved and default argument values are used', async () => {
      // Arrange
      const transactionData = [
        {
          address: 'lsks6uckwnap7s72ov3edddwgxab5e89t6uy8gjt6',
        },
      ];
      httpApi.mockResolvedValue({
        data: transactionData,
        meta: { total: 0 },
      });
      const expectedAction = {
        count: 0,
        confirmed: transactionData,
        address: transactionData.address,
        filters: {},
        offset: 0,
      };

      // Act
      await transactionsRetrieved(transactionData)(dispatch, getState);

      // Assert
      expect(dispatch).toHaveBeenNthCalledWith(1, {
        type: commonActionTypes.loadingStarted,
        data: actionTypes.transactionsRetrieved,
      });
      expect(dispatch).toHaveBeenNthCalledWith(2, {
        type: actionTypes.transactionsRetrieved,
        data: expectedAction,
      });
      expect(dispatch).toHaveBeenNthCalledWith(3, {
        type: commonActionTypes.loadingFinished,
        data: actionTypes.transactionsRetrieved,
      });
    });

    it('should dispatch transactionsLoadFailed action if rejected', async () => {
      // Arrange
      const transactionError = new Error('Transaction retrieve error');
      httpApi.mockRejectedValue(transactionError);

      // Act
      await transactionsRetrieved(data)(dispatch, getState);

      // Assert
      expect(httpApi).rejects.toThrow(transactionError);
      expect(dispatch).toHaveBeenCalledTimes(3);
      expect(dispatch).toHaveBeenNthCalledWith(1, {
        type: commonActionTypes.loadingStarted,
        data: actionTypes.transactionsRetrieved,
      });
      expect(dispatch).toHaveBeenNthCalledWith(2, {
        type: actionTypes.transactionLoadFailed,
        data: { error: transactionError },
      });
      expect(dispatch).toHaveBeenNthCalledWith(3, {
        type: commonActionTypes.loadingFinished,
        data: actionTypes.transactionsRetrieved,
      });
    });
  });

  describe('emptyTransaction', () => {
    it('should create an action to empty transactions', () => {
      const expectedAction = { type: actionTypes.emptyTransactionsData };
      expect(emptyTransactionsData()).toEqual(expectedAction);
    });
  });

  describe('pendingTransactionAdded', () => {
    it('should create an action to add pending transaction', () => {
      // Arrange
      const data = {
        moduleCommand: '1938573839:g45krEIjwK',
        id: '4emF3me9YJSbcIuOp',
        fee: '1032519n',
        nonce: '2n',
        signatures: ['xnVCm30IUhtYidgBX', 'uxsFGiaqS3n4ydB'],
        sender: {
          address: '3040783849904107057L',
          publicKey: 'MIICXAIBAAKBgQCqGKukO1De7zhZj6+H0qtjTkVxwTCpvKe4eCZ0FPqri0cb2JZfXJ/DgYSF6',
        },
        isPending: true,
      };
      const expectedAction = {
        type: actionTypes.pendingTransactionAdded,
        data,
      };

      // Assert
      expect(pendingTransactionAdded(data)).toEqual(expectedAction);
    });
  });

  describe('resetTransactionResult', () => {
    it('should create an action to reset transaction result', () => {
      const expectedAction = { type: actionTypes.resetTransactionResult };
      expect(resetTransactionResult()).toEqual(expectedAction);
    });
  });

  describe('transactionDoubleSigned', () => {
    const { network, wallet, token } = getState();
    const getStateWithTx = () => ({
      network,
      wallet: {
        ...wallet,
        secondPassphrase: accounts.genesis.passphrase,
        info: {
          ...wallet.info,
          LSK: accounts.multiSig,
        },
      },
      token,
      transactions: {
        signedTransaction: {
          module: 2,
          command: 0,
          senderPublicKey: Buffer.from(accounts.genesis.summary.publicKey, 'hex'),
          nonce: BigInt(49),
          fee: BigInt(209000),
          signatures: [
            '',
            Buffer.from(
              'd8a75de09db6ea245c9ddba429956e941adb657024fd01ae3223620a6da2f5dada722a2fc7f8a0c795a2bde8c4a18847b1ac633b21babbf4a628df22f84c5600',
              'hex'
            ),
          ],
          params: {
            recipientAddress: getAddressFromBase32Address(
              'lskdxc4ta5j43jp9ro3f8zqbxta9fn6jwzjucw7yt'
            ),
            amount: BigInt(100000),
            data: '2f',
          },
          id: Buffer.from(
            '7c98f8f3a042000abac0d1c38e6474f0571347d9d2a25929bcbac2a29747e31d',
            'hex'
          ),
        },
      },
    });

    it('should create an action to store double signed tx', async () => {
      // Consume the utility
      await transactionDoubleSigned()(dispatch, getStateWithTx);

      // Prepare expectations
      const expectedAction = {
        type: actionTypes.transactionDoubleSigned,
        data: expect.any(Object),
      };

      // Assert
      expect(dispatch).toHaveBeenCalledWith(expectedAction);
    });

    it.skip('should create an action to store signature error', async () => {
      // Prepare the store
      const error = new Error('error signing tx');
      jest.spyOn(transactionUtils, 'sign').mockImplementation(() => error);

      // Consume the utility
      await transactionDoubleSigned()(dispatch, getStateWithTx);

      // Prepare expectations
      const expectedAction = {
        type: actionTypes.transactionSignError,
        data: error,
      };

      // Assert
      expect(dispatch).toHaveBeenCalledWith(expectedAction);
    });
  });

  describe('transactionBroadcasted', () => {
    it('should dispatch broadcastedTransactionSuccess action if there are no errors', async () => {
      // Arrange
      httpApi.mockResolvedValue({ data: sampleTransaction });
      jest.spyOn(global, 'Date').mockImplementationOnce(() => new Date('2021-09-15T11:07:29.864Z'));
      const expectedAction = {
        type: actionTypes.broadcastedTransactionSuccess,
        data: sampleTransaction,
      };

      // Act
      await transactionBroadcasted(sampleTransaction)(dispatch, getState);

      // Assert
      expect(dispatch).toHaveBeenCalledWith(expectedAction);
    });

    it('should dispatch broadcastedTransactionError action when broadcast has an error', async () => {
      // Arrange
      const transactionBroadcastError = new Error('Transaction broadcast error');
      httpApi.mockRejectedValue(transactionBroadcastError);
      const expectedAction = {
        type: actionTypes.broadcastedTransactionError,
        data: {
          error: transactionBroadcastError,
          transaction: sampleTransaction,
        },
      };

      // Act
      await transactionBroadcasted(sampleTransaction)(dispatch, getState);

      // Assert
      expect(httpApi).toHaveBeenCalled();
      expect(dispatch).toHaveBeenCalledWith(expectedAction);
    });

    it('should dispatch pendingTransactionAdded action if transformedTransaction sender address is the same as LSK address', async () => {
      const transformedAccountTransaction = {
        ...sampleTransaction,
        id: 'ad0e0acbe8a3ece3087c8362149ca39c470e565d268df32e57de5d3fe2e1ea5c',
      };
      // Arrange
      httpApi.mockResolvedValue({ data: sampleTransaction });
      const expectedAction1 = {
        type: actionTypes.broadcastedTransactionSuccess,
        data: transformedAccountTransaction,
      };
      // const expectedAction2 = {
      //   type: actionTypes.pendingTransactionAdded,
      //   data: { ...transformedAccountTransaction, isPending: true },
      // };

      // Act
      await transactionBroadcasted(sampleTransaction)(dispatch, getState);

      // Assert
      expect(httpApi).toHaveBeenCalled();
      expect(dispatch).toHaveBeenNthCalledWith(1, expectedAction1);
    });
  });

  describe('multisigTransactionSigned', () => {
    const { network, wallet, token } = getState();
    const getStateWithTx = () => ({
      network,
      wallet: {
        ...wallet,
        secondPassphrase: accounts.multiSig.passphrase,
        info: {
          ...wallet.info,
          LSK: accounts.multiSig,
        },
      },
      token,
      transactions: {
        signedTransaction: sampleTransaction,
      },
    });
    const params = {
      rawTx: { signatures: [] },
      sender: { data: accounts.multiSig },
    };

    it('should create an action to store double signed tx', async () => {
      // Consume the utility
      jest
        .spyOn(transactionUtils, 'signMultisigTransaction')
        .mockImplementation(() => [{ id: 1 }, undefined]);
      await multisigTransactionSigned(params)(dispatch, getStateWithTx);

      // Prepare expectations
      const expectedAction = {
        type: actionTypes.transactionDoubleSigned,
        data: expect.any(Object),
      };

      // Assert
      expect(dispatch).toHaveBeenCalledWith(expectedAction);
    });

    it('should create an action to store signature error', async () => {
      // Prepare the store
      const error = { message: 'error signing tx' };
      jest
        .spyOn(transactionUtils, 'signMultisigTransaction')
        .mockImplementation(() => [undefined, error]);

      // Consume the utility
      await multisigTransactionSigned(params)(dispatch, getStateWithTx);

      // Prepare expectations
      const expectedAction = {
        type: actionTypes.transactionSignError,
        data: error,
      };

      // Assert
      expect(dispatch).toHaveBeenCalledWith(expectedAction);
    });
  });

  describe('signatureSkipped', () => {
    const props = {
      rawTx: {
        id: '9dc584c07c9d7ed77d54b6f8f43b8341c50e108cbcf582ceb3513388fe4ba84c',
        moduleCommand: 'token:transfer',
        fee: '10000000',
        nonce: 0,
        sender: { publicKey: '00f046aea2782180c51f7271249a0c107e6b6295c6b3c31e43c1a3ed644dcdeb' },
        params: {
          amount: '200',
          recipient: { address: 'lskz5r2nbgwrzjctbcffyrn8k74jdxdmd9cj9ng45' },
          data: 'test',
        },
        signatures: [
          'af975f7670394a1fe7eee4785c2a65f4604b1e7ad2e4367308738c86ed4837ace17960b32d6d7ceca2d5c2ae7709465bb69581d4ef2713ccef1d4ed4618c0d0a',
          'ae67d1418797e48afae2c8d3641bd0ee4807e307d22df71a84d50555438a03c3df1f9162b2d7e54836979e78925261944e2c5aadaf9f9534b5cb8956fa95f501',
        ],
      },
    };

    it('should return the tx ready to be broadcasted', () => {
      expect(signatureSkipped(props)).toEqual(
        expect.objectContaining({ type: actionTypes.signatureSkipped })
      );
    });
  });
});
