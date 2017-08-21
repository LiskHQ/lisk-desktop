import actionTypes from '../../constants/actions';

/**
 *
 * @param {Array} state
 * @param {Object} action
 */
const transactions = (state = { pending: [], confirmed: [], count: 0 }, action) => {
  let startTimestamp;

  switch (action.type) {
    case actionTypes.transactionAdded:
      return Object.assign({}, state, {
        pending: [action.data, ...state.pending],
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
      startTimestamp = state.confirmed.length ?
        state.confirmed[0].timestamp :
        0;
      return Object.assign({}, state, {
        // Filter any newly confirmed transaction from pending
        pending: state.pending.filter(
          pendingTransaction => action.data.confirmed.filter(
            transaction => transaction.id === pendingTransaction.id).length === 0),
        // Add any newly confirmed transaction to confirmed
        confirmed: [
          ...action.data.confirmed.filter(transaction => transaction.timestamp > startTimestamp),
          ...state.confirmed,
        ],
        count: action.data.count,
      });
    default:
      return state;
  }
};

export default transactions;
