import { actionTypes, loginTypes } from '@constants';
import * as hwManagerApi from '@common/utilities/hwManager';
import httpApi from '@common/utilities/api/http';
import * as transactionUtils from '@common/utilities/transaction';
import {
  emptyTransactionsData,
  transactionsRetrieved,
  resetTransactionResult,
  pendingTransactionAdded,
  transactionDoubleSigned,
  transactionBroadcasted,
  transactionCreated,
  multisigTransactionSigned,
  signatureSkipped,
} from './transactions';
import { sampleTransaction } from '../../../test/constants/transactions';
import { getState } from '../../../test/fixtures/transactions';
import accounts from '../../../test/constants/accounts';

jest.mock('@common/utilities/api/delegate');
jest.mock('@common/utilities/hwManager');
jest.mock('@common/utilities/api/http');

describe('actions: transactions', () => {
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
        type: actionTypes.loadingStarted,
        data: actionTypes.transactionsRetrieved,
      });
      expect(dispatch).toHaveBeenNthCalledWith(2, {
        type: actionTypes.transactionsRetrieved,
        data: expectedAction,
      });
      expect(dispatch).toHaveBeenNthCalledWith(3, {
        type: actionTypes.loadingFinished,
        data: actionTypes.transactionsRetrieved,
      });
    });

    it('should dispatch getTransactionsSuccess action if resolved and default argument values are used', async () => {
      // Arrange
      const transactionData = {
        address: 'lsks6uckwnap7s72ov3edddwgxab5e89t6uy8gjt6',
      };
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
        type: actionTypes.loadingStarted,
        data: actionTypes.transactionsRetrieved,
      });
      expect(dispatch).toHaveBeenNthCalledWith(2, {
        type: actionTypes.transactionsRetrieved,
        data: expectedAction,
      });
      expect(dispatch).toHaveBeenNthCalledWith(3, {
        type: actionTypes.loadingFinished,
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
        type: actionTypes.loadingStarted,
        data: actionTypes.transactionsRetrieved,
      });
      expect(dispatch).toHaveBeenNthCalledWith(2, {
        type: actionTypes.transactionLoadFailed,
        data: { error: transactionError },
      });
      expect(dispatch).toHaveBeenNthCalledWith(3, {
        type: actionTypes.loadingFinished,
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
        moduleAssetId: '1938573839:g45krEIjwK',
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

  describe('transactionCreated', () => {
    const state = getState();
    const activeAccount = {
      ...state.account.info.LSK,
      hwInfo: {
        deviceModel: 'Ledger Nano S',
      },
      passphrase: state.account.passphrase,
    };
    const getStateWithHW = () => ({
      ...state,
      account: {
        info: {
          LSK: activeAccount,
        },
        hwInfo: {
          deviceModel: 'Ledger Nano S',
        },
        passphrase: state.account.passphrase,
      },
    });

    it('should dispatch transactionCreatedSuccess action if there are no errors', async () => {
      // Arrange
      const data = {
        amount: '21000000',
        data: '',
        recipientAddress: 'lsky3t7xfxbcjf5xmskrbhkmwzxpowex6eubghtws',
        fee: 141000,
      };

      // Act
      await transactionCreated(data)(dispatch, getState);

      // Assert
      expect(hwManagerApi.signTransactionByHW).not.toHaveBeenCalled();
      // Replace toMatchSnapshot with a definitive assertion.
      expect(dispatch).toMatchSnapshot();
    });

    it('should dispatch transactionSignError action if there are errors during transaction creation', async () => {
      // Arrange
      const data = {
        amount: '21000000',
        data: '',
        recipientAddress: 'lsky3t7xfxbcjf5xmskrbhkmwzxpowex6eubghtws',
        fee: 141000,
      };
      const transactionError = new Error('Transaction create error');
      loginTypes.passphrase.code = 1;
      jest.spyOn(hwManagerApi, 'signTransactionByHW')
        .mockRejectedValue(transactionError);
      const expectedAction = {
        type: actionTypes.transactionSignError,
        data: transactionError,
      };
      // Act
      await transactionCreated(data)(dispatch, getStateWithHW);
      expect(dispatch).toHaveBeenCalledWith(expectedAction);
    });
  });

  describe('transactionDoubleSigned', () => {
    const { network, account, settings } = getState();
    const getStateWithTx = () => ({
      network,
      account: {
        ...account,
        secondPassphrase: accounts.genesis.passphrase,
        info: {
          ...account.info,
          LSK: accounts.multiSig,
        },
      },
      settings,
      transactions: {
        signedTransaction: sampleTransaction,
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
      jest.spyOn(transactionUtils, 'sign')
        .mockImplementation(() => error);

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
      jest
        .spyOn(global, 'Date')
        .mockImplementationOnce(() => new Date('2021-09-15T11:07:29.864Z'));
      const expectedAction = {
        type: actionTypes.broadcastedTransactionSuccess,
        data: sampleTransaction,
      };
      const lastExpectedAction = {
        type: actionTypes.timerReset,
        data: new Date(),
      };

      // Act
      await transactionBroadcasted(sampleTransaction)(dispatch, getState);

      // Assert
      expect(dispatch).toHaveBeenCalledWith(expectedAction);
      expect(dispatch).toHaveBeenLastCalledWith(lastExpectedAction);
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
      const expectedAction3 = { data: expect.anything(), type: actionTypes.timerReset };

      // Act
      await transactionBroadcasted(sampleTransaction)(dispatch, getState);

      // Assert
      expect(httpApi).toHaveBeenCalled();
      expect(dispatch).toHaveBeenNthCalledWith(1, expectedAction1);
      // expect(dispatch).toHaveBeenNthCalledWith(2, expectedAction2);
      expect(dispatch).toHaveBeenNthCalledWith(3, expectedAction3);
    });
  });

  describe('multisigTransactionSigned', () => {
    const { network, account, settings } = getState();
    const getStateWithTx = () => ({
      network,
      account: {
        ...account,
        secondPassphrase: accounts.multiSig.passphrase,
        info: {
          ...account.info,
          LSK: accounts.multiSig,
        },
      },
      settings,
      transactions: {
        signedTransaction: sampleTransaction,
      },
    });
    const params = {
      rawTransaction: { signatures: [] },
      sender: { data: accounts.multiSig },
    };

    it('should create an action to store double signed tx', async () => {
      // Consume the utility
      jest.spyOn(transactionUtils, 'signMultisigTransaction').mockImplementation(() => [{ id: 1 }, undefined]);
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
      jest.spyOn(transactionUtils, 'signMultisigTransaction').mockImplementation(() => [undefined, error]);

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
      rawTransaction: {
        id: '9dc584c07c9d7ed77d54b6f8f43b8341c50e108cbcf582ceb3513388fe4ba84c',
        moduleAssetId: '2:0',
        fee: '10000000',
        nonce: 0,
        sender: {
          publicKey: '00f046aea2782180c51f7271249a0c107e6b6295c6b3c31e43c1a3ed644dcdeb',
        },
        asset: {
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
        expect.objectContaining({ type: actionTypes.signatureSkipped }),
      );
    });
  });
});
