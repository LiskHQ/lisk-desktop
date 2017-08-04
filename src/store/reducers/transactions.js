import actionTypes from '../../constants/actions';

/**
 *
 * @param {Array} state
 * @param {Object} action
 */
const transactions = (state = { pending: [], confirmed: [] }, action) => {
  let startTimesamp;

  switch (action.type) {
    case actionTypes.transactionAdded:
      return Object.assign({}, state, {
        pending: [action.data, ...state.pending],
      });
    case actionTypes.transactionsLoaded:
      return Object.assign({}, state, {
        confirmed: [
          ...state.confirmed,
          ...action.data,
        ],
      });
    case actionTypes.transactionsUpdated:
      startTimesamp = state.confirmed.length ?
        state.confirmed[0].timestamp :
        0;
      return Object.assign({}, state, {
        // Filter any newly confirmed transaction from pending
        pending: state.pending.filter(
          pendingTransaction => action.data.filter(
            transaction => transaction.id === pendingTransaction.id).length === 0),
        // Add any newly confirmed transaction to confirmed
        confirmed: [
          ...action.data.filter(transaction => transaction.timestamp > startTimesamp),
          ...state.confirmed,
        ],
      });
    default:
      return state;
  }
};

export default transactions;
