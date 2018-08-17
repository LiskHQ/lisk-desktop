import actionTypes from '../constants/actions';
import { getAccount } from '../utils/api/account';

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

export const followedAccountFetchedAndUpdated = ({ account }) =>
  (dispatch, getState) => {
    const activePeer = getState().peers.data;
    getAccount(activePeer, account.address).then((result) => {
      if (result.balance !== account.balance) {
        account.balance = result.balance;
        dispatch(followedAccountUpdated(account));
      }
    });
  };
