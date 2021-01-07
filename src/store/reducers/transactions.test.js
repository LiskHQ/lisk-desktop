import transactions from './transactions';
import actionTypes from '../../constants/actions';
import txFilter from '../../constants/transactionFilters';
import { resetTransactionResult } from '../../actions/transactions';

describe('Reducer: transactions', () => {
  const defaultState = {
    pending: [],
    confirmed: [],
    transactionsCreated: [],
    transactionsCreatedFailed: [],
    broadcastedTransactionsError: [],
  };
  const mockTransactions = [{
    amount: 100000000000,
    id: '16295820046284152875',
    timestamp: 33505748,
  }, {
    amount: 200000000000,
    id: '8504241460062789191',
    timestamp: 33505746,
  }, {
    amount: 300000000000,
    id: '18310904473760006068',
    timestamp: 33505743,
  }];

  describe('transactionsRetrieved', () => {
    it('should prepend newer transactions and remove from state.pending', () => {
      const state = {
        ...defaultState,
        pending: [mockTransactions[0]],
        confirmed: [mockTransactions[1], mockTransactions[2]],
        count: mockTransactions[1].length + mockTransactions[2].length,
      };
      const action = {
        type: actionTypes.transactionsRetrieved,
        data: {
          confirmed: mockTransactions,
          count: mockTransactions.length,
        },
      };
      const changedState = transactions(state, action);
      expect(changedState).toEqual({
        ...defaultState,
        confirmed: mockTransactions,
        count: mockTransactions.length,
      });
    });

    it('Should fill the empty state with fetched transactions', () => {
      const state = defaultState;
      const action = {
        type: actionTypes.transactionsRetrieved,
        data: {
          confirmed: mockTransactions,
          count: 3,
        },
      };
      const changedState = transactions(state, action);
      expect(changedState).toEqual({
        ...defaultState,
        confirmed: mockTransactions,
        count: mockTransactions.length,
      });
    });

    it('should reduce transactions when loaded with filters', () => {
      const state = {
        ...defaultState,
      };
      const data = {
        confirmed: mockTransactions,
        count: mockTransactions.length,
        filters: {
          direction: txFilter.all,
          dateFrom: '1',
          dateTo: '2',
          amountFrom: '3',
          amountTo: '4',
          message: '5',
        },
      };
      const action = { type: actionTypes.transactionsRetrieved, data };
      const changedState = transactions(state, action);
      expect(changedState).toEqual({
        ...defaultState,
        ...data,
      });
    });

    it('should reduce transactions when loaded without filters', () => {
      const state = {
        ...defaultState,
      };
      const data = {
        confirmed: mockTransactions,
        count: mockTransactions.length,
      };
      const action = { type: actionTypes.transactionsRetrieved, data };
      const changedState = transactions(state, action);
      expect(changedState).toEqual({
        ...defaultState,
        ...data,
      });
    });
  });

  describe('addNewPendingTransaction', () => {
    it('should prepend pending transactions', () => {
      const state = {
        ...defaultState,
        pending: [mockTransactions[1]],
      };
      const action = {
        type: actionTypes.addNewPendingTransaction,
        data: mockTransactions[0],
      };
      const changedState = transactions(state, action);
      expect(changedState).toEqual({ ...state, pending: [action.data, ...state.pending] });
    });
  });

  describe('transactionFailed', () => {
    it('should add property `failed` with error message if action.type = actionTypes.transactionFailed', () => {
      const state = {
        ...defaultState,
      };

      const errorMessage = 'transaction failed';

      const action = {
        data: { errorMessage },
        type: actionTypes.transactionFailed,
      };
      const changedState = transactions(state, action);
      expect(changedState).toEqual({ ...state, failed: { errorMessage } });
    });
  });

  describe('transactionFailedClear', () => {
    it('should remove property `failed`', () => {
      const errorMessage = 'transaction failed';
      const state = {
        ...defaultState,
        failed: { errorMessage },
      };

      const action = {
        type: actionTypes.transactionFailedClear,
      };
      const changedState = transactions(state, action);
      expect(changedState).toEqual({ ...defaultState });
    });
  });

  describe('transactionsFailed', () => {
    it('should filter out failed transactions from pending', () => {
      const state = {
        ...defaultState,
        pending: [mockTransactions[1]],
      };
      const data = {
        failed: [mockTransactions[1]],
      };
      const action = {
        data,
        type: actionTypes.transactionsFailed,
      };
      const pendingTransactionsFiltered = transactions(state, action);
      const stateWithNoPendingTransactions = { ...defaultState };
      expect(pendingTransactionsFiltered).toEqual(stateWithNoPendingTransactions);
    });
  });

  describe('accountSwitched', () => {
    it('should reset all data', () => {
      const state = {
        ...defaultState,
        pending: [{
          amount: 110000000000,
          id: '16295820046284152275',
          timestamp: 33506748,
        }],
        confirmed: mockTransactions,
      };
      const action = { type: actionTypes.accountSwitched };
      const changedState = transactions(state, action);
      expect(changedState).toEqual({
        ...defaultState,
        count: 0,
      });
    });
  });

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
          direction: txFilter.all,
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

  describe('ResetTransactionResult', () => {
    it('Should update transactions reducer for ResetTransactionResult', () => {
      const newState = {
        pending: [],
        confirmed: [],
        transactionsCreated: [],
        transactionsCreatedFailed: [],
        broadcastedTransactionsError: [{ id: '123' }],
      };
      const actionResult = resetTransactionResult();
      const changedState = transactions(newState, actionResult);
      expect(changedState.transactionsCreated).toEqual([]);
      expect(changedState.broadcastedTransactionsError).toEqual([]);
      expect(changedState.transactionsCreatedFailed).toEqual([]);
    });
  });
});
