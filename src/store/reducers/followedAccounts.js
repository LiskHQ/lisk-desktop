import { getIndexOfFollowedAccount, getFollowedAccountsFromLocalStorage } from '../../utils/followedAccounts';
import actionTypes from '../../constants/actions';

const followedAccounts = (state = getFollowedAccountsFromLocalStorage(), action) => {
  switch (action.type) {
    case actionTypes.followedAccountAdded:
      return {
        ...state,
        [action.data.token]: [
          ...state[action.data.token],
          {
            ...action.data.account,
            addedAt: new Date().getTime(),
          },
        ],
      };

    case actionTypes.followedAccountUpdated: {
      const indexOfAccount = getIndexOfFollowedAccount(state, {
        address: action.data.account.address,
        token: action.data.token,
      });
      const accounts = state[action.data.token];
      if (indexOfAccount !== -1) {
        const changedAccount = {
          ...accounts[indexOfAccount],
          address: action.data.account.address,
          title: action.data.account.title,
          publicKey: action.data.account.publicKey,
        };
        accounts[indexOfAccount] = changedAccount;
      }

      return {
        ...state,
        [action.data.token]: accounts,
      };
    }
    case actionTypes.followedAccountRemoved:
      return {
        ...state,
        [action.data.token]:
          state[action.data.token].filter(account => !(account.address === action.data.address)),
      };

    default:
      return state;
  }
};

export default followedAccounts;
