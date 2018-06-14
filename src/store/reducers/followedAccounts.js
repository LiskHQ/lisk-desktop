import { getIndexOfFollowedAccount } from '../../utils/followedAccounts';
import actionTypes from '../../constants/actions';

const followedAccounts = (state = { accounts: [] }, action) => {
  const accounts = [...state.accounts];
  let indexOfAccount;

  switch (action.type) {
    case actionTypes.followedAccountsRetrieved:
      return { accounts: action.data };

    case actionTypes.followedAccountAdded:
      accounts.push(action.data);
      return { accounts };

    case actionTypes.followedAccountUpdated:
      indexOfAccount = getIndexOfFollowedAccount(state.accounts, action.data);

      if (indexOfAccount !== -1) {
        const changedAccount = {
          ...accounts[indexOfAccount],
          balance: action.data.balance,
          address: action.data.address,
          title: action.data.title,
        };
        accounts[indexOfAccount] = changedAccount;
      }

      return { accounts };

    case actionTypes.followedAccountRemoved:
      return {
        ...state,
        accounts: state.accounts.filter(account => !(account.address === action.data.address)),
      };

    default:
      return state;
  }
};

export default followedAccounts;
