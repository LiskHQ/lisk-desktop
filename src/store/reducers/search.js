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
  searchResults: [] }, action) => {
  switch (action.type) {
    case actionTypes.searchMoreTransactionsLoaded : {
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
          },
        },
        lastSearch: action.data.address,
        searchResults: addressTransactions,
      };
    }
    case actionTypes.searchTransactionsLoaded :
      return {
        ...state,
        transactions: {
          ...state.transactions,
          [action.data.address]: action.data,
        },
        lastSearch: action.data.address,
        searchResults: action.data.transactions,
      };
    case actionTypes.searchUpdateLast :
      return {
        ...state,
        lastSearch: action.data.address,
        searchResults: state.transactions[action.data.address].transactions,
      };
    case actionTypes.searchAccountLoaded :
      return {
        ...state,
        accounts: {
          ...state.accounts,
          [action.data.address]: action.data,
        },
      };
    case actionTypes.searchDelegateLoaded :
      return {
        ...state,
        delegates: {
          ...state.delegates,
          [action.data.address]: action.data,
        },
      };
    default:
      return state;
  }
};

export default search;
