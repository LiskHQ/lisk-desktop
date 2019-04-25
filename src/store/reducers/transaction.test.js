import transaction from './transaction';
import actionTypes from '../../constants/actions';

describe('Reducer: transaction(state, action)', () => {
  const mockTransaction = {
    transaction: {
      amount: 100000000000,
      id: '16295820046284152875',
      timestamp: 33505748,
    },
    senderId: '11195820046284152875',
  };

  it('should return empty object if action.type = actionTypes.transactionCleared', () => {
    const state = [];
    const action = {
      type: actionTypes.transactionCleared,
    };
    const changedState = transaction(state, action);
    expect(changedState).toEqual({});
  });

  it('should return transaction if action.type = actionTypes.transactionLoaded', () => {
    const state = [];
    const action = {
      type: actionTypes.transactionLoaded,
      data: mockTransaction,
    };
    const changedState = transaction(state, action);
    expect(changedState).toEqual({
      votesName: {},
      ...mockTransaction,
    });
  });

  it('should return error if action.type = actionTypes.transactionLoadFailed', () => {
    const state = [];
    const error = { success: false, error: 'Transaction not found' };
    const action = {
      type: actionTypes.transactionLoadFailed,
      data: { error },
    };
    const changedState = transaction(state, action);
    expect(changedState).toEqual({ ...error });
  });

  it('should add new Delegate object', () => {
    const state = [];
    const actionAdd = {
      type: actionTypes.transactionAddDelegateName,
      data: {
        voteArrayName: 'added',
        delegate: { id: 123 },
      },
    };
    let changedState = transaction(state, actionAdd);
    expect(changedState).toEqual({ votesName: { added: [{ id: 123 }] } });

    const actionDelete = {
      type: actionTypes.transactionAddDelegateName,
      data: {
        voteArrayName: 'deleted',
        delegate: { id: 123123 },
      },
    };
    changedState = transaction(changedState, actionDelete);
    expect(changedState).toEqual({
      votesName: {
        added: [{ id: 123 }],
        deleted: [{ id: 123123 }],
      },
    });
  });
});
