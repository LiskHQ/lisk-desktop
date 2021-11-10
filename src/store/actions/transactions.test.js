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
import accounts from '../../../test/constants/accounts';
import { getState, transformedAccountTransaction, newTransaction } from '../../../test/fixtures/transactions';
import signedTransaction from '../../../test/fixtures/signedTx.json';

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
      expect(hwManagerApi.signTransactionByHW).toHaveBeenCalledTimes(0);
      expect(transactionsApi.computeTransactionId).toHaveBeenCalledTimes(0);
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

    it('should dispatch signed transaction from hardware wallet with transaction id', async () => {
      // Arrange
      loginTypes.passphrase.code = 1;
      transactionsApi.create.mockResolvedValue({ tx: newTransaction });
      hwManagerApi.signTransactionByHW.mockResolvedValue(newTransaction);
      const expectedAction = {
        type: actionTypes.transactionCreatedSuccess,
        data: expect.anything(),
      };

      // Act
      await transactionCreated(newTransaction)(dispatch, getState);

      // Assert
      expect(transactionsApi.create).toHaveBeenCalled();
      expect(hwManagerApi.signTransactionByHW).toHaveBeenCalled();
      expect(transactionsApi.computeTransactionId).toHaveBeenCalled();
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
      expect(hwManagerApi.signTransactionByHW).toHaveBeenCalled();
      expect(transactionsApi.computeTransactionId).toHaveBeenCalledTimes(0);
      expect(dispatch).toHaveBeenCalledWith(expectedAction);
    });
  });

  describe('transactionDoubleSigned', () => {
    transactionsModifyApi.transformTransaction.mockReturnValue({
      moduleAssetId: '2:0',
      id: 'f8ddab3b1a23d7c19e17855fe82ca5c1fa701ba82b8896da2ba332fccc308e90',
      fee: '207000',
      nonce: '19',
      signatures: [
        {
          type: 'Buffer',
          data: [],
        },
        {
          type: 'Buffer',
          // eslint-disable-next-line max-len
          data: [193, 83, 141, 74, 106, 154, 208, 111, 153, 199, 64, 82, 0, 126, 223, 90, 149, 53, 175, 19, 100, 107, 116, 125, 165, 184, 206, 190, 178, 229, 8, 139, 235, 29, 152, 57, 28, 30, 143, 193, 50, 230, 110, 138, 203, 191, 188, 13, 228, 65, 187, 225, 90, 45, 240, 40, 174, 37, 108, 32, 115, 186, 104, 8],
        },
      ],
      sender: {
        address: 'lskwunwxqmss9w3mtuvzgbsfy665cz4eo3rd2mxdp',
        publicKey: '6b40b2c68d52b1532d0374a078974798cff0b59d0a409a8d574378fe2c69daef',
      },
      asset: {
        amount: '12000000',
        data: '',
        recipient: { address: 'lskhqy429nwm2tew3j5j29ef6pguyynf6jxcmgrh2' },
      },
    });
    const { network, account, settings } = getState();
    const getStateWithTx = () => ({
      network,
      account,
      settings,
      transactions: {
        signedTransaction,
      },
    });

    it('should create an action to store double signed tx', async () => {
      // Prepare the store
      transactionsModifyApi.signTransaction.mockReturnValue([{
        id: 'f8ddab3b1a23d7c19e17855fe82ca5c1fa701ba82b8896da2ba332fccc308e90',
      }]);

      // Consume the utility
      await transactionDoubleSigned({
        secondPass: accounts.secondPass.secondPass,
      })(dispatch, getStateWithTx);

      // Prepare expectations
      const expectedAction = {
        type: actionTypes.transactionDoubleSigned,
        data: { id: 'f8ddab3b1a23d7c19e17855fe82ca5c1fa701ba82b8896da2ba332fccc308e90' },
      };

      // Assert
      expect(dispatch).toHaveBeenCalledWith(expectedAction);
    });

    it('should create an action to store signature error', async () => {
      // Prepare the store
      const error = { message: 'error signing tx' };
      transactionsModifyApi.signTransaction.mockReturnValue([{
        id: 'f8ddab3b1a23d7c19e17855fe82ca5c1fa701ba82b8896da2ba332fccc308e90',
      }, error]);

      // Consume the utility
      await transactionDoubleSigned({
        secondPass: accounts.secondPass.secondPass,
      })(dispatch, getStateWithTx);

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
