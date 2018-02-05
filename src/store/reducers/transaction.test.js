import { expect } from 'chai';
import transaction from './transaction';
import actionTypes from '../../constants/actions';

describe('Reducer: transaction(state, action)', () => {
  const mockTransaction = {
    transaction: {
      amount: 100000000000,
      id: '16295820046284152875',
      timestamp: 33505748,
    },
    success: true,
  };

  it('should return transaction if action.type = actionTypes.transactionLoaded', () => {
    const state = [];
    const action = {
      type: actionTypes.transactionLoaded,
      data: mockTransaction,
    };
    const changedState = transaction(state, action);
    expect(changedState).to.deep.equal({ success: true, ...mockTransaction.transaction });
  });
});
