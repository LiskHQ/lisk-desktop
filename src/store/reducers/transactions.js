import actionTypes from '../../constants/actions';
import txFilters from '../../constants/transactionFilters';

// TODO the sort should be removed when BTC api returns transactions sorted by timestamp
const sortByTimestamp = (a, b) => (
  (!a.timestamp || a.timestamp > b.timestamp) && b.timestamp ? -1 : 1
);

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
    case actionTypes.getTransactionsSuccess:
      return {
        ...state,
        // TODO the sort should be removed when BTC api returns transactions sorted by timestamp
        confirmed: action.data.confirmed.sort(sortByTimestamp),
        count: action.data.count,
        filters: action.data.filters !== undefined
          ? action.data.filters : state.filters,
      };
    case actionTypes.updateTransactions:
      return {
        ...state, // Filter any newly confirmed transaction from pending
        pending: addNewTransactions(state.pending, action.data.confirmed),
        // Add any newly confirmed transaction to confirmed
        confirmed: [
          ...action.data.confirmed,
          ...addNewTransactions(state.confirmed, action.data.confirmed),
        // TODO the sort should be removed when BTC api returns transactions sorted by timestamp
        ].sort(sortByTimestamp),
        count: action.data.count,
        filters: action.data.filters !== undefined
          ? action.data.filters : state.filters,
      };
    // TODO can be remove after move send (create) tx to utils file
    // istanbul ignore next
    case actionTypes.transactionCreatedSuccess:
      return {
        ...state,
        transactionsCreated: [...state.transactionsCreated, action.data],
      };
    // TODO can be remove after move send (create) tx to utils file
    // istanbul ignore next
    case actionTypes.transactionCreatedError:
      return {
        ...state,
        transactionsCreatedFailed: [...state.transactionsCreatedFailed, action.data],
      };
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
          .some(tx => tx.transaction.id === action.data.id)
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
