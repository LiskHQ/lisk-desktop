import { expect } from 'chai';
import transactions from './transactions';
import actionTypes from '../../constants/actions';
import txFilter from '../../constants/transactionFilters';

describe('Reducer: transactions(state, action)', () => {
  const defaultState = { };
  const mockTransactions = [{
    amount: 100000000000,
    id: '16295820046284152875',
    timestamp: 33505748,
    address: 'my-address',
  }, {
    amount: 200000000000,
    id: '8504241460062789191',
    timestamp: 33505746,
    address: 'my-address',
  }, {
    amount: 300000000000,
    id: '18310904473760006068',
    timestamp: 33505743,
    address: 'my-address',
  }];

  it('should prepend action.data to state.pending if action.type = actionTypes.transactionAdded', () => {
    const state = {
      ...defaultState,
      'my-address': {
        pending: [mockTransactions[1]],
      },
    };
    const action = {
      type: actionTypes.transactionAdded,
      data: mockTransactions[0],
    };
    const changedState = transactions(state, action);
    expect(changedState).to.deep.equal({ ...state, 'my-address': { pending: [action.data, ...state['my-address'].pending] } });
  });

  it('should add property `failed` with error message if action.type = actionTypes.transactionFailed', () => {
    const state = {
      ...defaultState,
    };

    const errorMessage = 'transaction failed';

    const action = {
      data: {
        errorMessage,
        address: 'my-address',
      },
      type: actionTypes.transactionFailed,
    };

    const expectedState = {
      ...state,
      'my-address': {
        failed: {
          errorMessage,
        },
      },
    };

    const changedState = transactions(state, action);
    expect(changedState).to.deep.equal(expectedState);
  });

  it('should filter out failed transactions from pending', () => {
    const state = {
      ...defaultState,
    };
    const data = {
      failed: [mockTransactions[1]],
      address: 'my-address',
    };
    const action = {
      data,
      type: actionTypes.transactionsFailed,
    };
    const pendingTransactionsFiltered = transactions(state, action);
    const stateWithNoPendingTransactions = {
      ...defaultState,
      'my-address': {
        pending: [],
      },
    };
    expect(pendingTransactionsFiltered).to.deep.equal(stateWithNoPendingTransactions);
  });

  it('should concat action.data to state.confirmed if action.type = actionTypes.transactionsLoaded', () => {
    const state = { ...defaultState };
    const action = {
      type: actionTypes.transactionsLoaded,
      data: {
        confirmed: mockTransactions,
        count: mockTransactions.length,
        address: 'my-address',
      },
    };
    const expectedState = {
      ...defaultState,
      'my-address': {
        confirmed: action.data.confirmed,
        count: action.data.count,
      },
    };
    const changedState = transactions(state, action);
    expect(changedState).to.deep.equal(expectedState);
  });

  it('should prepend newer transactions from action.data to state.confirmed and remove from state.pending if action.type = actionTypes.transactionsUpdated', () => {
    const state = {
      ...defaultState,
      'my-address': {
        pending: [mockTransactions[0]],
        confirmed: [mockTransactions[1], mockTransactions[2]],
        count: mockTransactions[1].length + mockTransactions[2].length,
      },
    };
    const action = {
      type: actionTypes.transactionsUpdated,
      data: {
        confirmed: mockTransactions,
        count: 3,
        address: 'my-address',
      },
    };
    const expectedState = {
      ...defaultState,
      'my-address': {
        pending: [],
        confirmed: mockTransactions,
        count: mockTransactions.length,
      },
    };
    const changedState = transactions(state, action);
    expect(changedState).to.deep.equal(expectedState);
  });

  it('should action.data to state.confirmed if state.confirmed is empty and action.type = actionTypes.transactionsUpdated', () => {
    const state = {
      ...defaultState,
      'my-address': {
        confirmed: [],
        pending: [],
      },
    };
    const action = {
      type: actionTypes.transactionsUpdated,
      data: {
        confirmed: mockTransactions,
        count: 3,
        address: 'my-address',
      },
    };
    const expectedState = {
      ...defaultState,
      'my-address': {
        pending: [],
        confirmed: mockTransactions,
        count: mockTransactions.length,
      },
    };
    const changedState = transactions(state, action);
    expect(changedState).to.deep.equal(expectedState);
  });

  it('should reduce transactions and account when loading Transactions', () => {
    const state = {
      ...defaultState,
    };
    const data = {
      confirmed: mockTransactions,
      count: mockTransactions.length,
      balance: 100,
      address: 'my-address',
      delegate: { username: 'test1' },
    };

    const action = { type: actionTypes.transactionsLoadFinish, data };

    const expectedState = {
      ...defaultState,
      [data.address]: {
        confirmed: data.confirmed,
        count: data.count,
        account: {
          address: data.address,
          balance: data.balance,
          delegate: data.delegate,
        },
        filter: txFilter.all,
      },
    };

    const changedState = transactions(state, action);

    expect(changedState).to.deep.equal(expectedState);
  });
});
