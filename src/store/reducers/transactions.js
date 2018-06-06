import actionTypes from '../../constants/actions';
import txFilter from '../../constants/transactionFilters';
/**
 *
 * @param {Array} state
 * @param {Object} action
 */
const transactions = (state = { pending: [], confirmed: [], count: null }, action) => {
  switch (action.type) {
    case actionTypes.transactionAdded:
      return Object.assign({}, state, {
        pending: [action.data, ...state.pending],
      });
    case actionTypes.transactionFailed:
      return Object.assign({}, state, {
        failed: { errorMessage: action.data.errorMessage },
      });
    case actionTypes.transactionsFailed:
      return Object.assign({}, state, {
        // Filter any failed transaction from pending
        pending: state.pending.filter(pendingTransaction =>
          action.data.failed.filter(transaction =>
            transaction.id === pendingTransaction.id).length === 0),
      });
    case actionTypes.transactionsLoaded:
      return Object.assign({}, state, {
        confirmed: [
          ...state.confirmed,
          ...action.data.confirmed,
        ],
        count: action.data.count,
      });
    case actionTypes.transactionsUpdated:
      return Object.assign({}, state, {
        // Filter any newly confirmed transaction from pending
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
      });
    case actionTypes.transactionsFiltered:
      return Object.assign({}, state, {
        confirmed: action.data.confirmed,
        count: action.data.count,
        filter: action.data.filter,
      });
    case actionTypes.transactionsLoadFinish:
      return Object.assign({}, state, {
        confirmed: action.data.confirmed,
        count: action.data.count,
        account: {
          address: action.data.address,
          balance: action.data.balance,
          delegate: action.data.delegate,
        },
        filter: txFilter.all,
      });
    case (actionTypes.accountSwitched):
      return { pending: [], confirmed: [], count: 0 };
    default:
      return state;
  }
};

export default transactions;
