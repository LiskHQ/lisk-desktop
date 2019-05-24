import actionTypes from '../../constants/actions';
import txFilters from '../../constants/transactionFilters';
/**
 *
 * @param {Array} state
 * @param {Object} action
 */
const initialState = {
  pending: [],
  confirmed: [],
  count: null,
  filters: {
    direction: txFilters.all,
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
    case actionTypes.cleanTransactions:
      return initialState;
    case actionTypes.addPendingTransaction:
      return { ...state, pending: [action.data, ...state.pending] };
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
    case actionTypes.transactionsLoaded:
      return {
        ...state,
        confirmed: action.data.confirmed,
        count: action.data.count,
        filters: action.data.filters !== undefined ?
          action.data.filters : state.filters,
      };
    case actionTypes.updateTransactions:
      return {
        ...state, // Filter any newly confirmed transaction from pending
        pending: state.pending.filter(pendingTransaction =>
          action.data.confirmed.filter(transaction =>
            transaction.id === pendingTransaction.id).length === 0),
        // Add any newly confirmed transaction to confirmed
        confirmed: [
          ...action.data.confirmed,
          ...state.confirmed.filter(confirmedTransaction =>
            action.data.confirmed.filter(transaction =>
              transaction.id === confirmedTransaction.id).length === 0),
        ],
        count: action.data.count,
        filters: action.data.filters !== undefined ?
          action.data.filters : state.filters,
      };
    case actionTypes.transactionCreatedSuccess:
      return {
        ...state,
        transactionsCreated: [...state.transactionsCreated, action.data],
      };
    case actionTypes.transactionCreatedError:
      return {
        ...state,
        transactionsCreatedFailed: [...state.transactionsCreatedFailed, action.data],
      };
    case actionTypes.broadcastedTransactionSuccess:
      return {
        ...state,
        transactionsCreated: state.transactionsCreated.filter(tx => tx.id !== action.data.id),
        broadcastedTransactionsError: state.broadcastedTransactionsError
          .filter(tx => tx.id !== action.data.id),
      };
    case actionTypes.broadcastedTransactionError:
      return {
        ...state,
        transactionsCreated: state.transactionsCreated.filter(tx => tx.id !== action.data.id),
        broadcastedTransactionsError: [...state.broadcastedTransactionsError, action.data],
      };
    case actionTypes.resetTransactionResult:
      return {
        ...state,
        transactionsCreated: [],
        transactionsFailed: [],
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
