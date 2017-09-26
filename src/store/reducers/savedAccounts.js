import actionTypes from '../../constants/actions';

/**
 *
 * @param {Array} state
 * @param {Object} action
 */
const savedAccounts = (state = [], action) => {
  switch (action.type) {
    case actionTypes.accountsRetrieved:
      return action.data;
    case actionTypes.accountSaved:
      return [
        ...state,
        action.data,
      ];
    case actionTypes.accountRemoved:
      return state.filter(account => account.publicKey !== action.data);
    default:
      return state;
  }
};

export default savedAccounts;
