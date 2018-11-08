import actionTypes from '../../constants/actions';
import txFilter from '../../constants/transactionFilters';
/**
 *
 * @param {Array} state
 * @param {Object} action
 */
const initialState = { };
const transactions = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.cleanTransactions:
      return initialState;
    case actionTypes.transactionAdded: {
      return Object.assign({}, state, {
        [action.data.address]: {
          pending: [action.data, ...state[action.data.address] ?
            state[action.data.address].pending || [] : []],
        },
      });
    }
    case actionTypes.transactionFailed:
      return Object.assign({}, state, {
        [action.data.address]: {
          failed: { errorMessage: action.data.errorMessage },
        },
      });
    case actionTypes.transactionsFailed:
      return Object.assign({}, state, {
        [action.data.address]: {
          // Filter any failed transaction from pending
          pending: state[action.data.address] ?
            [...state[action.data.address].pending || []].filter(pendingTransaction =>
              action.data.failed.filter(transaction =>
                transaction.id === pendingTransaction.id).length === 0) : [],
        },
      });
    case actionTypes.transactionsLoaded:
      return Object.assign({}, state, {
        [action.data.address]: {
          confirmed: [
            ...state[action.data.address] ? state[action.data.address].confirmed : [],
            ...action.data.confirmed,
          ],
          count: action.data.count,
        },
      });
    case actionTypes.transactionsUpdated:
      return Object.assign({}, state, {
        [action.data.address]: {
          // Filter any newly confirmed transaction from pending
          pending: state[action.data.address] ?
            [...state[action.data.address].pending || []].filter(pendingTransaction =>
              action.data.confirmed.filter(transaction =>
                transaction.id === pendingTransaction.id).length === 0) : [],
          // Add any newly confirmed transaction to confirmed
          confirmed: state[action.data.address] ? [
            ...action.data.confirmed,
            ...state[action.data.address].confirmed.filter(confirmedTransaction =>
              action.data.confirmed.filter(transaction =>
                transaction.id === confirmedTransaction.id).length === 0),
          ] : [],
          count: action.data.count,
        },
      });
    case actionTypes.transactionsFiltered:
      return Object.assign({}, state, {
        [action.data.address]: {
          confirmed: action.data.confirmed,
          count: action.data.count,
          filter: action.data.filter,
        },
      });
    case actionTypes.transactionsLoadFinish:
      return Object.assign({}, state, {
        [action.data.address]: {
          confirmed: action.data.confirmed,
          count: action.data.count,
          account: {
            address: action.data.address,
            balance: action.data.balance,
            delegate: action.data.delegate,
          },
          filter: txFilter.all,
        },
      });
    default:
      return state;
  }
};

export default transactions;
