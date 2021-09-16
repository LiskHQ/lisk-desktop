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
import { sampleTransaction, transformedAccountTransaction, newTransaction } from '../../../test/constants/transactions';

jest.mock('@api/transaction');
jest.mock('@api/delegate');
jest.mock('@utils/transaction');
jest.mock('@utils/hwManager');

describe('actions: transactions', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  const dispatch = jest.fn();
  const getState = () => ({
    account: {
      passphrase: 'test',
      info: {
        LSK: {
          summary: { address: 'lsks6uckwnap7s72ov3edddwgxab5e89t6uy8gjt6' },
        },
        BTC: {
          summary: { address: '16Qp9op3fTESTBTCACCOUNTv52ghRzYreUuQ' },
        },
      },
      loginType: 0,
    },
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
    transactions: {
      filters: {},
    },
    settings: {
      token: {
        active: 'LSK',
      },
    },
    blocks: {
      latestBlocks: [{
        timestamp: 123123123,
      }],
    },
  });

  describe('getTransactions', () => {
    const data = {
      address: '15626650747375562521L',
      limit: 20,
      offset: 0,
      filters: {},
    };

    it('should create an action function', () => {
      expect(typeof transactionsRetrieved(data)).toBe('function');
    });

    it('should dispatch getTransactionsSuccess action if resolved', async () => {
      transactionsApi.getTransactions.mockResolvedValue({ data: [], meta: { total: 0 } });
      const expectedAction = {
        count: 0,
        confirmed: [],
        address: data.address,
        filters: data.filters,
        offset: 0,
      };

      await transactionsRetrieved(data)(dispatch, getState);
      expect(dispatch).toHaveBeenLastCalledWith({
        type: actionTypes.transactionsRetrieved,
        data: expectedAction,
      });
    });

    it('should dispatch getTransactionsSuccess action if resolved and default argument values are used', async () => {
      const transactionData = {
        address: '15626650747375562521L',
      };
      transactionsApi.getTransactions.mockResolvedValue({
        data: transactionData, meta: { total: 0 },
      });
      const expectedAction = {
        count: 0,
        confirmed: [],
        address: transactionData.address,
        filters: {},
        offset: 0,
      };

      await transactionsRetrieved(transactionData)(dispatch, getState);
      expect(dispatch).toHaveBeenLastCalledWith({
        type: actionTypes.transactionsRetrieved,
        data: expectedAction,
      });
    });

    it('should dispatch transactionsLoadFailed action if rejected', async () => {
      const transactionError = new Error('Transaction retrieve error');
      transactionsApi.getTransactions.mockRejectedValue(transactionError);

      expect(transactionsApi.getTransactions).rejects.toThrow('Transaction retrieve error');

      await transactionsRetrieved(data)(dispatch, getState);
      expect(transactionsApi.getTransactions).rejects.toThrow(transactionError);
      expect(dispatch).toHaveBeenCalledTimes(2);
      expect(dispatch).toHaveBeenNthCalledWith(1, {
        type: actionTypes.loadingStarted,
        data: actionTypes.transactionsRetrieved,
      });
      expect(dispatch).toHaveBeenNthCalledWith(2, {
        type: actionTypes.transactionLoadFailed,
        data: { error: transactionError },
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
      transactionsApi.create.mockResolvedValue({ tx: newTransaction });
      const expectedAction = {
        type: actionTypes.transactionCreatedSuccess,
        data: { tx: newTransaction },
      };
      await transactionCreated(newTransaction)(dispatch, getState);
      expect(transactionsApi.create).toHaveBeenCalled();
      expect(dispatch).toHaveBeenCalledWith(expectedAction);
    });

    it('should dispatch transactionSignError action if there are errors', async () => {
      const transactionError = new Error('Transaction create error');
      loginTypes.passphrase.code = 1;
      hwManagerApi.signSendTransaction.mockRejectedValue(transactionError);
      expect(hwManagerApi.signSendTransaction).rejects.toThrow(transactionError);
      const expectedAction = {
        type: actionTypes.transactionSignError,
        data: transactionError,
      };
      await transactionCreated(newTransaction)(dispatch, getState);
      expect(hwManagerApi.signSendTransaction).toHaveBeenCalled();
      expect(dispatch).toHaveBeenCalledWith(expectedAction);
    });

    it('should dispatch transactionSignError action if there are no transaction signatures', async () => {
      loginTypes.passphrase.code = 1;
      const noSignatureTransaction = {
        pending: [],
        confirmed: [],
        count: null,
        filters: {},
      };
      hwManagerApi.signSendTransaction.mockResolvedValue({ tx: noSignatureTransaction });
      const expectedAction = {
        type: actionTypes.transactionSignError,
        data: null,
      };
      await transactionCreated(newTransaction)(dispatch, getState);
      expect(hwManagerApi.signSendTransaction).toHaveBeenCalled();
      expect(dispatch).toHaveBeenCalledWith(expectedAction);
    });
  });

  describe('transactionDoubleSigned', () => {
    it('should create an action to reset transaction result', () => {
      const data = {
        id: 'a66c3cb626dbb631e53a5bd617cc8c13f06186c91f42e87008331e6dc4dc3cba',
        signatures: ['ofh49fhfnYHK8499dvvn', '0egeJT7dgdnek4n5k6994k'],
        senderPublicKey: 'MIICXAIBAAKBgQCqGKukO1De7zhZj6+H0qtjTkVxwTCpvKe4eCZ0FPqri0cb2JZfXJ/DgYSF6',
      };
      const expectedAction = {
        type: actionTypes.transactionDoubleSigned,
        data,
      };
      expect(transactionDoubleSigned(data)).toEqual(expectedAction);
    });
  });

  describe('transactionBroadcasted', () => {
    it('should dispatch broadcastedTransactionSuccess action if there are no errors', async () => {
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

      await transactionBroadcasted(sampleTransaction)(dispatch, getState);
      expect(transactionsApi.broadcast).toHaveBeenCalled();
      expect(dispatch).toHaveBeenCalledWith(expectedAction);
      expect(dispatch).toHaveBeenLastCalledWith(lastExpectedAction);
    });

    it('should dispatch broadcastedTransactionError action if there\'s an error', async () => {
      const transactionBroadcastError = new Error('Transaction broadcast error');
      transactionsApi.broadcast.mockRejectedValue(transactionBroadcastError);

      expect(transactionsApi.broadcast).rejects.toThrow(transactionBroadcastError);
      const expectedAction = {
        type: actionTypes.broadcastedTransactionError,
        data: {
          error: transactionBroadcastError,
          transaction: sampleTransaction,
        },
      };
      expect(transactionsApi.broadcast).toHaveBeenCalled();
      await transactionBroadcasted(sampleTransaction)(dispatch, getState);
      expect(dispatch).toHaveBeenCalledWith(expectedAction);
    });

    it('should dispatch pendingTransactionAdded action if transformedTransaction sender address is the same as LSK address', async () => {
      transactionsApi.broadcast.mockResolvedValue({ data: sampleTransaction });
      transactionsModifyApi.transformTransaction.mockReturnValue(transformedAccountTransaction);

      const expectedAction = {
        type: actionTypes.pendingTransactionAdded,
        data: { ...transformedAccountTransaction, isPending: true },
      };
      await transactionBroadcasted(sampleTransaction)(dispatch, getState);
      expect(transactionsModifyApi.transformTransaction).toHaveBeenCalled();
      expect(dispatch).toHaveBeenCalledWith(expectedAction);
    });
  });
});
