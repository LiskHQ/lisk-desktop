import { resetTransactionResult } from 'src/redux/actions';
import actionTypes from './actionTypes';
import transactions from './reducer';

describe('Reducer: transactions', () => {
  const defaultState = {
    pending: [],
    confirmed: [],
    signedTransaction: {},
    txSignatureError: null,
    txBroadcastError: null,
  };
  const mockTransactions = [
    {
      amount: 100000000000,
      id: '16295820046284152875',
      timestamp: 33505748,
    },
    {
      amount: 200000000000,
      id: '8504241460062789191',
      timestamp: 33505746,
    },
    {
      amount: 300000000000,
      id: '18310904473760006068',
      timestamp: 33505743,
    },
  ];

  describe('emptyTransactionsData', () => {
    it('should reset all data', () => {
      const state = {
        ...defaultState,
        pending: null,
        confirmed: null,
        count: null,
        filters: null,
      };

      const expectedState = {
        ...defaultState,
        pending: [],
        confirmed: [],
        count: null,
        filters: {
          dateFrom: '',
          dateTo: '',
          amountFrom: '',
          amountTo: '',
          message: '',
        },
      };

      const action = { type: actionTypes.emptyTransactionsData };
      const changedState = transactions(state, action);
      expect(changedState).toEqual(expectedState);
    });
  });

  describe('pendingTransactionAdded', () => {
    it('should prepend pending transactions', () => {
      const state = {
        ...defaultState,
        pending: [mockTransactions[1]],
      };
      const action = {
        type: actionTypes.pendingTransactionAdded,
        data: mockTransactions[0],
      };
      const changedState = transactions(state, action);
      expect(changedState).toEqual({ ...state, pending: [action.data, ...state.pending] });
    });
  });

  describe('transactionCreatedSuccess', () => {
    it('should store the signed transaction', () => {
      const state = {
        ...defaultState,
        signedTransaction: null,
      };
      const action = {
        type: actionTypes.transactionCreatedSuccess,
        data: mockTransactions[0],
      };
      const changedState = transactions(state, action);
      expect(changedState).toEqual({
        ...defaultState,
        signedTransaction: mockTransactions[0],
      });
    });
  });

  describe('signatureSkipped', () => {
    it('should store the signed transaction', () => {
      const state = {
        ...defaultState,
        signedTransaction: null,
      };
      const action = {
        type: actionTypes.signatureSkipped,
        data: mockTransactions[0],
      };
      const changedState = transactions(state, action);
      expect(changedState).toEqual({
        ...defaultState,
        signedTransaction: mockTransactions[0],
      });
    });
  });

  describe('transactionSignError', () => {
    it('should store the signed creation/signature error', () => {
      const state = {
        ...defaultState,
        txSignatureError: null,
      };
      const action = {
        type: actionTypes.transactionSignError,
        data: { error: 'someError' },
      };
      const changedState = transactions(state, action);
      expect(changedState).toEqual({
        ...defaultState,
        txSignatureError: {
          error: 'someError',
          message: 'The transaction failed',
          name: 'TransactionFailedError',
        },
      });
    });
  });

  describe('broadcastedTransactionSuccess', () => {
    it('Should clean the state ready for next transaction', () => {
      const tx = {
        id: '12312334',
        senderId: '123L',
        recipientId: '456L',
        amount: '0.01',
        data: 'sending',
      };
      const state = {
        pending: [{ id: 3 }],
        confirmed: [{ id: 1 }, { id: 2 }],
        signedTransaction: tx,
        txSignatureError: null,
        txBroadcastError: null,
      };
      const actionResult = { type: actionTypes.broadcastedTransactionSuccess };
      const changedState = transactions(state, actionResult);
      expect(changedState).toEqual({
        ...state,
        signedTransaction: {},
        txBroadcastError: null,
      });
    });
  });

  describe('broadcastedTransactionError', () => {
    it('should store the error in txBroadcastError', () => {
      const action = {
        type: actionTypes.broadcastedTransactionError,
        data: { message: 'network error' },
      };
      const state = {
        signedTransaction: {},
        txBroadcastError: null,
      };
      const changedState = transactions(state, action);
      expect(changedState).toEqual({
        ...state,
        txBroadcastError: action.data,
      });
    });

    it('should not stack the same transaction in txBroadcastError and should replace it with the latest error', () => {
      const networkError = { message: 'network error' };
      const apiError = { message: 'API error' };
      const state = {
        signedTransaction: {},
        txBroadcastError: { error: networkError, transaction: mockTransactions[0] },
      };
      const action = {
        type: actionTypes.broadcastedTransactionError,
        data: { transaction: mockTransactions[0], error: apiError },
      };
      const changedState = transactions(state, action);
      expect(changedState).toEqual({
        ...state,
        txBroadcastError: { error: apiError, transaction: mockTransactions[0] },
      });
    });
  });

  describe('ResetTransactionResult', () => {
    it('Should update transactions reducer for ResetTransactionResult', () => {
      const newState = {
        pending: [],
        confirmed: [],
        signedTransaction: {},
        txSignatureError: null,
        txBroadcastError: { id: '123' },
      };
      const actionResult = resetTransactionResult();
      const changedState = transactions(newState, actionResult);
      expect(changedState.signedTransaction).toEqual({});
      expect(changedState.txBroadcastError).toEqual(null);
      expect(changedState.txSignatureError).toEqual(null);
    });
  });
});
