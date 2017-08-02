import actionTypes from '../../constants/actions';

/**
 *
 * @param {Array} state
 * @param {Object} action
 */
const dialog = (state = { pending: [], confirmed: [] }, action) => {
  let startTimesamp;

  switch (action.type) {
    case actionTypes.transactionAdded:
      return Object.assign({}, state, { pending: [...state.pending, action.data] });
    case actionTypes.transactionsLoaded:
      return Object.assign({}, state, {
        confirmed: [
          ...state.confirmed,
          ...action.data,
        ],
      });
    case actionTypes.transactionsUpdated:
      startTimesamp = state && state.confirmed && state.confirmed.length ?
        state.confirmed[0].timestamp :
        0;
      return Object.assign({}, state, {
        pending: state.pending.filter(
          tx => action.data.filter(tx2 => tx2.id === tx.id).length === 0),
        confirmed: [
          ...action.data.filter(tx => tx.timestamp > startTimesamp),
          ...state.confirmed,
        ],
      });
    default:
      return state;
  }
};

export default dialog;
