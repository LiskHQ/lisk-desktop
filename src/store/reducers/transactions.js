import actionTypes from '../../constants/actions';

const addNewTransactions = (array1, array2) => array1.filter(array1Value =>
  array2.filter(array2Value => array2Value.id === array1Value.id).length === 0);

/**
 * Initial State
 * @param {Array} state
 * @param {Object} action
 */
const initialState = {
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
  transactionsCreated: [],
  transactionsCreatedFailed: [],
  broadcastedTransactionsError: [],
};
const transactions = (state = initialState, action) => { // eslint-disable-line complexity
  switch (action.type) {
    case actionTypes.emptyTransactionsData:
      return initialState;
    case actionTypes.addNewPendingTransaction:
      return {
        ...state,
        pending: [action.data, ...state.pending],
      };
    case actionTypes.transactionFailed:
      return { ...state, failed: { ...action.data } };
    case actionTypes.transactionFailedClear:
      return { ...state, failed: undefined };
    case actionTypes.transactionsFailed:
      return {
        ...state, // Filter any failed transaction from pending
        pending: state.pending.filter(pendingTransaction =>
          action.data.failed.filter(transaction =>
            transaction.id === pendingTransaction.id).length === 0),
      };
    case actionTypes.transactionsRetrieved: {
      const confirmed = action.data.offset === 0
        ? [
          ...addNewTransactions(action.data.confirmed, state.confirmed),
          ...state.confirmed,
        ] : [
          ...state.confirmed,
          ...addNewTransactions(action.data.confirmed, state.confirmed),
        ];
      return {
        ...state,
        confirmed,
        count: action.data.count,
        filters: action.data.filters || state.filters,
        pending: addNewTransactions(state.pending, action.data.confirmed),
      };
    }
    // TODO can be remove after move send (create) tx to utils file
    // istanbul ignore next
    case actionTypes.transactionCreatedSuccess:
      return {
        ...state,
        transactionsCreated: [...state.transactionsCreated, action.data],
      };
    // TODO can be remove after move send (create) tx to utils file
    // istanbul ignore next
    case actionTypes.transactionCreatedError: {
      const { message = 'The transaction failed', name = 'TransactionFailedError' } = action.data;
      return {
        ...state,
        transactionsCreatedFailed: [...state.transactionsCreatedFailed, { message, name }],
      }; }
    // TODO can be remove after use HOC for send (broadcast) tx
    // istanbul ignore next
    case actionTypes.broadcastedTransactionSuccess:
      return {
        ...state,
        transactionsCreated: state.transactionsCreated.filter(tx => tx.id !== action.data.id),
        broadcastedTransactionsError: state.broadcastedTransactionsError
          .filter(tx => tx.transaction.id !== action.data.id),
      };
    // TODO can be remove after use HOC for send (broadcast) tx
    // istanbul ignore next
    case actionTypes.broadcastedTransactionError:
      return {
        ...state,
        transactionsCreated: state.transactionsCreated.filter(tx => tx.id !== action.data.id),
        broadcastedTransactionsError: state.broadcastedTransactionsError
          .some(tx => tx.transaction.id === action.dta.id)
          ? state.broadcastedTransactionsError
          : [...state.broadcastedTransactionsError, action.data],
      };
    // TODO can be remove after use HOC for send tx
    case actionTypes.resetTransactionResult:
      return {
        ...state,
        transactionsCreated: [],
        transactionsCreatedFailed: [],
        broadcastedTransactionsError: [],
      };
    case (actionTypes.accountSwitched):
      return {
        ...state, pending: [], confirmed: [], count: 0,
      };
    default:
      return state;
  }
};

export default transactions;
