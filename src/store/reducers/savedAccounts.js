import actionTypes from '../../constants/actions';

/**
 *
 * @param {Array} state
 * @param {Object} action
 */
const savedAccounts = (state = { accounts: [] }, action) => {
  switch (action.type) {
    case actionTypes.accountsRetrieved:
      return action.data;
    case actionTypes.accountSaved:
      return {
        ...state,
        accounts: [
          ...state.accounts,
          action.data,
        ],
      };
    case actionTypes.accountRemoved:
      return {
        ...state,
        accounts: state.accounts.filter(account =>
          !(account.publicKey === action.data.publicKey &&
          account.network === action.data.network)),
      };
    default:
      return state;
  }
};

export default savedAccounts;
