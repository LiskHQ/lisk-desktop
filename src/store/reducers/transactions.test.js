import transactions from './transactions';
import actionTypes from '../../constants/actions';
import txFilter from '../../constants/transactionFilters';
import { resetTransactionResult } from '../../actions/transactions';

describe('Reducer: transactions(state, action)', () => {
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

  it('should prepend action.data to state.pending if action.type = actionTypes.addNewPendingTransaction', () => {
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

  it('should remove property `failed` if action.type = actionTypes.transactionFailedClear', () => {
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

  it('should prepend newer transactions from action.data to state.confirmed and remove from state.pending if action.type = actionTypes.updateTransactions', () => {
    const state = {
      ...defaultState,
      pending: [mockTransactions[0]],
      confirmed: [mockTransactions[1], mockTransactions[2]],
      count: mockTransactions[1].length + mockTransactions[2].length,
    };
    const action = {
      type: actionTypes.updateTransactions,
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

  it('should action.data to state.confirmed if state.confirmed is empty and action.type = actionTypes.updateTransactions', () => {
    const state = {
      ...defaultState,
    };
    const action = {
      type: actionTypes.updateTransactions,
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

  it('should reset all data if action.type = actionTypes.accountSwitched', () => {
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
    const action = { type: actionTypes.getTransactionsSuccess, data };
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
    const action = { type: actionTypes.getTransactionsSuccess, data };
    const changedState = transactions(state, action);
    expect(changedState).toEqual({
      ...defaultState,
      ...data,
    });
  });

  it('should reset all data if action.type = emptyTransactionsData', () => {
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

  it('should add broadcastedTransactionsError', () => {
    const networkError = { message: 'network error' };
    const transaction1 = { id: 111 };
    const transaction2 = { id: 222 };
    const state = {
      transactionsCreated: [],
      broadcastedTransactionsError: [],
    };
    const action = {
      type: actionTypes.broadcastedTransactionError,
      data: { transaction1, networkError },
    };
    const action2 = {
      type: actionTypes.broadcastedTransactionError,
      data: { transaction2, networkError },
    };
    let changedState = transactions(state, action);
    expect(changedState).toEqual({
      ...state,
      broadcastedTransactionsError: [{ networkError, transaction1 }],
    });
    changedState = transactions(state, action2);
    expect(changedState).toEqual({
      ...state,
      broadcastedTransactionsError: [{ networkError, transaction1 }, { networkError, transaction2 }],
    });
  });

  it('should not stack the same transaction in broadcastedTransactionsError', () => {
    const networkError = { message: 'network error' };
    const apiError = { message: 'API error' };
    const transaction = { id: 111 };
    const state = {
      transactionsCreated: [],
      broadcastedTransactionsError: [{ networkError, transaction }],
    };
    const action = {
      type: actionTypes.broadcastedTransactionError,
      data: { transaction, apiError },
    };
    const changedState = transactions(state, action);
    expect(changedState).toEqual({
      ...state,
      broadcastedTransactionsError: [{ apiError, transaction }],
    });
  });

  // it('Should update transactions reducer for TransactionCreatedSuccess on RETRY', () => {
  //   const tx = {
  //     id: '12312334',
  //     senderId: '123L',
  //     recipientId: '456L',
  //     amount: '0.01',
  //     data: 'sending',
  //   };
  //   const newState = {
  //     pending: [],
  //     confirmed: [],
  //     transactionsCreated: [],
  //     transactionsCreatedFailed: [],
  //     broadcastedTransactionsError: [{ transaction: tx }],
  //   };
  //   const actionResult = broadcastedTransactionSuccess(tx);
  //   const changedState = transactions(newState, actionResult);
  //   expect(changedState.transactionsCreated).toEqual([]);
  //   expect(changedState.broadcastedTransactionsError).toEqual([]);
  // });
});
