import { actionTypes, loginTypes } from '@constants';
import * as transactionsApi from '@api/transaction';
import * as transactionsModifyApi from '@utils/transaction';
import * as hwManagerApi from '@utils/hwManager';
import {
  emptyTransactionsData,
  transactionsRetrieved,
  resetTransactionResult,
  pendingTransactionAdded,
  transactionDoubleSigned,
  transactionBroadcasted,
  transactionCreated,
} from './transactions';
import { sampleTransaction } from '../../../test/constants/transactions';
import { getState, transformedAccountTransaction, newTransaction } from '../../../test/fixtures/transactions';

jest.mock('@api/transaction');
jest.mock('@api/delegate');
jest.mock('@utils/transaction');
jest.mock('@utils/hwManager');

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
      transactionsApi.getTransactions.mockResolvedValue({ data: [], meta: { total: 0 } });
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
      transactionsApi.getTransactions.mockResolvedValue({
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
      transactionsApi.getTransactions.mockRejectedValue(transactionError);

      // Act
      await transactionsRetrieved(data)(dispatch, getState);

      // Assert
      expect(transactionsApi.getTransactions).rejects.toThrow('Transaction retrieve error');
      expect(transactionsApi.getTransactions).rejects.toThrow(transactionError);
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
    it('should dispatch transactionCreatedSuccess action if there are no errors', async () => {
      // Arrange
      transactionsApi.create.mockResolvedValue({ tx: newTransaction });
      const expectedAction = {
        type: actionTypes.transactionCreatedSuccess,
        data: { tx: newTransaction },
      };

      // Act
      await transactionCreated(newTransaction)(dispatch, getState);

      // Assert
      expect(transactionsApi.create).toHaveBeenCalled();
      expect(dispatch).toHaveBeenCalledWith(expectedAction);
    });

    it('should dispatch transactionSignError action if there are errors during transaction creation', async () => {
      // Arrange
      const transactionError = new Error('Transaction create error');
      loginTypes.passphrase.code = 1;
      transactionsApi.create.mockRejectedValue(transactionError);
      const expectedAction = {
        type: actionTypes.transactionSignError,
        data: transactionError,
      };

      // Act
      await transactionCreated(newTransaction)(dispatch, getState);

      // Assert
      expect(transactionsApi.create).rejects.toThrow(transactionError);
      expect(transactionsApi.create).toHaveBeenCalled();
      expect(dispatch).toHaveBeenCalledWith(expectedAction);
    });

    it('should dispatch transactionSignError when signTransactionByHW returns error', async () => {
      // Arrange
      transactionsApi.create.mockResolvedValue([{ tx: { networkIdentifier: '', transactionObject: {}, transactionBytes: '' } }]);
      loginTypes.passphrase.code = 1;
      const transactionError = new Error('Transaction sign error');
      const result = { error: transactionError, tx: null };
      hwManagerApi.signTransactionByHW.mockRejectedValue(result);
      const expectedAction = {
        type: actionTypes.transactionSignError,
        data: result,
      };

      // Act
      await transactionCreated(newTransaction)(dispatch, getState);

      // Assert
      // expect(hwManagerApi.signTransactionByHW).rejects.toThrow(transactionError);
      expect(hwManagerApi.signTransactionByHW).toHaveBeenCalled();
      expect(dispatch).toHaveBeenCalledWith(expectedAction);
    });
  });

  describe('transactionDoubleSigned', () => {
    it('should create an action to reset transaction result', () => {
      // Arrange
      const data = {
        id: 'a66c3cb626dbb631e53a5bd617cc8c13f06186c91f42e87008331e6dc4dc3cba',
        signatures: ['ofh49fhfnYHK8499dvvn', '0egeJT7dgdnek4n5k6994k'],
        senderPublicKey: 'MIICXAIBAAKBgQCqGKukO1De7zhZj6+H0qtjTkVxwTCpvKe4eCZ0FPqri0cb2JZfXJ/DgYSF6',
      };
      const expectedAction = {
        type: actionTypes.transactionDoubleSigned,
        data,
      };

      // Assert
      expect(transactionDoubleSigned(data)).toEqual(expectedAction);
    });
  });

  describe('transactionBroadcasted', () => {
    it('should dispatch broadcastedTransactionSuccess action if there are no errors', async () => {
      // Arrange
      transactionsApi.broadcast.mockResolvedValue({ data: sampleTransaction });
      transactionsModifyApi.transformTransaction.mockImplementation(
        () => transformedAccountTransaction,
      );
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
      expect(transactionsApi.broadcast).toHaveBeenCalled();
      expect(dispatch).toHaveBeenCalledWith(expectedAction);
      expect(dispatch).toHaveBeenLastCalledWith(lastExpectedAction);
    });

    it('should dispatch broadcastedTransactionError action if there\'s an error', async () => {
      // Arrange
      const transactionBroadcastError = new Error('Transaction broadcast error');
      transactionsApi.broadcast.mockRejectedValue(transactionBroadcastError);
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
      expect(transactionsApi.broadcast).rejects.toThrow(transactionBroadcastError);
      expect(transactionsApi.broadcast).toHaveBeenCalled();
      expect(dispatch).toHaveBeenCalledWith(expectedAction);
    });

    it('should dispatch pendingTransactionAdded action if transformedTransaction sender address is the same as LSK address', async () => {
      // Arrange
      transactionsApi.broadcast.mockResolvedValue({ data: sampleTransaction });
      transactionsModifyApi.transformTransaction.mockReturnValue(transformedAccountTransaction);
      const expectedAction = {
        type: actionTypes.pendingTransactionAdded,
        data: { ...transformedAccountTransaction, isPending: true },
      };

      // Act
      await transactionBroadcasted(sampleTransaction)(dispatch, getState);

      // Assert
      expect(transactionsModifyApi.transformTransaction).toHaveBeenCalled();
      expect(dispatch).toHaveBeenCalledWith(expectedAction);
    });
  });
});
