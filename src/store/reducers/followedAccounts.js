import { getIndexOfFollowedAccount } from '../../utils/followedAccounts';
import actionTypes from '../../constants/actions';

const followedAccounts = (state = { accounts: [] }, action) => {
  const accounts = [...state.accounts];
  let indexOfAccount;
  let changedAccount;

  switch (action.type) {
    case actionTypes.followedAccountsRetrieved:
      return { accounts: Array.isArray(action.data) ? action.data : [action.data] };

    case actionTypes.followedAccountAdded:
      accounts.push(action.data);
      return { accounts };

    case actionTypes.followedAccountUpdated:
      indexOfAccount = getIndexOfFollowedAccount(state.accounts, action.data);
      changedAccount = action.data;

      if (indexOfAccount !== -1) {
        changedAccount = {
          ...accounts[indexOfAccount],
          balance: action.data.balance,
          publicKey: action.data.publicKey,
          title: action.data.title,
        };
        accounts[indexOfAccount] = changedAccount;
      }

      return { accounts };

    case actionTypes.followedAccountRemoved:
      return {
        ...state,
        accounts: state.accounts.filter(account => !(account.publicKey === action.data.publicKey)),
      };

    default:
      return state;
  }
};

export default followedAccounts;
