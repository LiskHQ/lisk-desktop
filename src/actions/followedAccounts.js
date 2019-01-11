import actionTypes from '../constants/actions';
import { getAccount } from '../utils/api/account';

export const followedAccountAdded = account =>
  (dispatch, getState) => {
    const liskAPIClient = getState().peers.liskAPIClient;
    getAccount(liskAPIClient, account.address).then((response) => {
      dispatch({
        data: { ...account, publicKey: response.publicKey },
        type: actionTypes.followedAccountAdded,
      });
    });
  };

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
    const liskAPIClient = getState().peers.liskAPIClient;
    getAccount(liskAPIClient, account.address).then((result) => {
      if (result.balance !== account.balance || result.publicKey !== account.publicKey) {
        account.balance = result.balance;
        account.publicKey = result.publicKey;
        dispatch(followedAccountUpdated(account));
      }
    });
  };
