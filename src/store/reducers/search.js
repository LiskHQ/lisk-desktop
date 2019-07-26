// TODO remove this reducer and use src/utils/withData.js instead
import actionTypes from '../../constants/actions';

// TODO the sort should be removed when BTC api returns transactions sorted by timestamp
const sortByTimestamp = (a, b) => (
  (!a.timestamp || a.timestamp > b.timestamp) && b.timestamp ? -1 : 1
);

/**
 *
 * @param {Array} state
 * @param {Object} action
 */
const search = (state = { // eslint-disable-line complexity
  transactions: {},
  accounts: {},
  delegates: {},
  votes: {},
  suggestions: {
    delegates: [],
    addresses: [],
    transactions: [],
  },
  searchResults: [],
}, action) => {
  switch (action.type) {
    case actionTypes.searchMoreTransactions: {
      const addressTransactions = [
        ...state.transactions[action.data.address].transactions,
        ...action.data.transactions,
      // TODO the sort should be removed when BTC api returns transactions sorted by timestamp
      ].sort(sortByTimestamp);
      return {
        ...state,
        transactions: {
          ...state.transactions,
          [action.data.address]: {
            transactions: addressTransactions,
            count: action.data.count,
            filter: action.data.filter,
            address: action.data.address,
          },
        },
        lastSearch: action.data.address,
        searchResults: addressTransactions,
      };
    }
    case actionTypes.searchTransactions:
      return {
        ...state,
        transactions: {
          ...state.transactions,
          [action.data.address]: {
            ...action.data,
            transactions: action.data.transactions.sort(sortByTimestamp),
          },
        },
        lastSearch: action.data.address,
        searchResults: action.data.transactions,
      };
    case actionTypes.searchAccount:
      return {
        ...state,
        accounts: {
          ...state.accounts,
          [action.data.address]: action.data,
        },
      };
    case actionTypes.searchDelegate:
      return {
        ...state,
        delegates: {
          ...state.delegates,
          [action.data.address]: action.data.delegate,
        },
      };
    case actionTypes.searchVotes:
      return {
        ...state,
        votes: {
          ...state.votes,
          [action.data.address]: action.data.votes,
        },
      };
    default:
      return state;
  }
};

export default search;
