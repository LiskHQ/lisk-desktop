/* istanbul ignore file */
// TODO remove this reducer and use src/utils/withData.js instead
import actionTypes from '../../constants/actions';

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
