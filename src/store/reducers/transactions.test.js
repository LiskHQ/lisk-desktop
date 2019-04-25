import transactions from './transactions';
import actionTypes from '../../constants/actions';
import txFilter from '../../constants/transactionFilters';

describe('Reducer: transactions(state, action)', () => {
  const defaultState = {
    pending: [],
    confirmed: [],
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

  it('should prepend action.data to state.pending if action.type = actionTypes.transactionAdded', () => {
    const state = {
      ...defaultState,
      pending: [mockTransactions[1]],
    };
    const action = {
      type: actionTypes.transactionAdded,
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

  it('should concat action.data to state.confirmed if action.type = actionTypes.transactionsLoaded', () => {
    const state = { ...defaultState };
    const action = {
      type: actionTypes.transactionsLoaded,
      data: {
        confirmed: mockTransactions,
        count: mockTransactions.length,
      },
    };
    const expectedState = {
      ...defaultState,
      confirmed: action.data.confirmed,
      count: action.data.count,
    };
    const changedState = transactions(state, action);
    expect(changedState).toEqual(expectedState);
  });

  it('should prepend newer transactions from action.data to state.confirmed and remove from state.pending if action.type = actionTypes.transactionsUpdated', () => {
    const state = {
      ...defaultState,
      pending: [mockTransactions[0]],
      confirmed: [mockTransactions[1], mockTransactions[2]],
      count: mockTransactions[1].length + mockTransactions[2].length,
    };
    const action = {
      type: actionTypes.transactionsUpdated,
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

  it('should action.data to state.confirmed if state.confirmed is empty and action.type = actionTypes.transactionsUpdated', () => {
    const state = {
      ...defaultState,
    };
    const action = {
      type: actionTypes.transactionsUpdated,
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

  it('should reduce transactions when filtered', () => {
    const state = {
      ...defaultState,
    };
    const data = {
      confirmed: mockTransactions,
      count: mockTransactions.length,
      filter: txFilter.all,
      customFilters: {
        dateFrom: '1',
        dateTo: '2',
        amountFrom: '3',
        amountTo: '4',
        message: '5',
      },
    };
    const action = { type: actionTypes.transactionsFiltered, data };
    const changedState = transactions(state, action);
    expect(changedState).toEqual({
      ...defaultState,
      ...data,
    });
  });

  it('should reduce transactions and account when loading Transactions', () => {
    const state = {
      ...defaultState,
    };
    const data = {
      confirmed: mockTransactions,
      count: mockTransactions.length,
      balance: 100,
      address: '123L',
      delegate: { username: 'test1' },
    };
    const action = { type: actionTypes.transactionsLoadFinish, data };
    const changedState = transactions(state, action);

    expect(changedState).toEqual({
      ...defaultState,
      confirmed: data.confirmed,
      count: data.count,
      account: {
        address: data.address,
        balance: data.balance,
        delegate: data.delegate,
      },
      filter: txFilter.all,
    });
  });

  it('should reset all data if action.type = cleanTransactions', () => {
    const state = {
      pending: null,
      confirmed: null,
      count: null,
      customFilters: null,
    };

    const expectedState = {
      pending: [],
      confirmed: [],
      count: null,
      customFilters: {
        dateFrom: '',
        dateTo: '',
        amountFrom: '',
        amountTo: '',
        message: '',
      },
    };

    const action = { type: actionTypes.cleanTransactions };
    const changedState = transactions(state, action);
    expect(changedState).toEqual(expectedState);
  });
});
