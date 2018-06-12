import actionTypes from '../constants/actions';
import { getAccount } from '../utils/api/account';
import { extractAddress } from '../utils/account';

export const followedAccountAdded = account => ({
  data: account,
  type: actionTypes.followedAccountAdded,
});

export const followedAccountUpdated = account => ({
  data: account,
  type: actionTypes.followedAccountUpdated,
});

export const followedAccountRemoved = account => ({
  data: account,
  type: actionTypes.followedAccountRemoved,
});

export const followedAccountsRetrieved = accounts => ({
  data: accounts,
  type: actionTypes.followedAccountsRetrieved,
});

export const followedAccountFetchedAndUpdated = ({ activePeer, account }) =>
  (dispatch) => {
    const address = extractAddress(account.publicKey);
    getAccount(activePeer, address).then((result) => {
      if (result.balance !== account.balance) {
        account.balance = result.balance;
        dispatch(followedAccountUpdated(account));
      }
    });
  };
