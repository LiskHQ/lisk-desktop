import { expect } from 'chai';
import transactions from './transactions';
import actionTypes from '../../constants/actions';

describe('Reducer: transactions(state, action)', () => {
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
      pending: [mockTransactions[1]],
      confirmed: [],
    };
    const action = {
      type: actionTypes.transactionAdded,
      data: mockTransactions[0],
    };
    const changedState = transactions(state, action);
    expect(changedState).to.deep.equal({ ...state, pending: [action.data, mockTransactions[1]] });
  });

  it('should concat action.data to state.confirmed if action.type = actionTypes.transactionsLoaded', () => {
    const state = {
      pending: [],
      confirmed: [],
    };
    const action = {
      type: actionTypes.transactionsLoaded,
      data: [mockTransactions[0]],
    };
    const changedState = transactions(state, action);
    expect(changedState).to.deep.equal({ ...state, confirmed: action.data });
  });

  it('should prepend newer transactions from action.data to state.confirmed and remove from state.pending if action.type = actionTypes.transactionsUpdated', () => {
    const state = {
      pending: [mockTransactions[0]],
      confirmed: [mockTransactions[1], mockTransactions[2]],
    };
    const action = {
      type: actionTypes.transactionsUpdated,
      data: mockTransactions,
    };
    const changedState = transactions(state, action);
    expect(changedState).to.deep.equal({ pending: [], confirmed: mockTransactions });
  });

  it('should action.data to state.confirmed if state.confirmed is empty and action.type = actionTypes.transactionsUpdated', () => {
    const state = {
      pending: [],
      confirmed: [],
    };
    const action = {
      type: actionTypes.transactionsUpdated,
      data: mockTransactions,
    };
    const changedState = transactions(state, action);
    expect(changedState).to.deep.equal({ pending: [], confirmed: mockTransactions });
  });
});
