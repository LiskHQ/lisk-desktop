import actionTypes from '../../constants/actions';

/**
 *
 * @param {Array} state
 * @param {Object} action
 */
const search = (state = {
  transactions: {},
  accounts: {},
  delegates: {},
  votes: {},
  voters: {},
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
      ];
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
          [action.data.address]: action.data,
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
    case actionTypes.searchVoters:
      return {
        ...state,
        voters: {
          ...state.voters,
          [action.data.address]: (state.voters[action.data.address]
            && state.voters[action.data.address].length > 0)
            ? [...state.voters[action.data.address], ...action.data.voters] : action.data.voters,
        },
        votersSize: action.data.votersSize,
      };
    case actionTypes.searchSuggestions:
      return {
        ...state,
        suggestions: {
          ...action.data[0],
          ...action.data[1],
          ...action.data[2],
        },
      };
    case actionTypes.searchClearSuggestions:
      return {
        ...state,
        suggestions: {
          delegates: [],
          addresses: [],
          transactions: [],
        },
      };
    default:
      return state;
  }
};

export default search;
