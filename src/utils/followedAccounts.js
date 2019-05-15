import localJSONStorage from './localJSONStorage';
import { tokenKeys } from '../constants/tokens';

export const flattenFollowedAccounts = accounts =>
  Object.keys(accounts).reduce((acc, token) =>
    [...acc, ...accounts[token]], []);

export const getFollowedAccountsFromLocalStorage = () => {
  const followedAccountsObj = tokenKeys.reduce((acc, token) => ({ ...acc, [token]: [] }), {});
  const followedAccounts = localJSONStorage.get('followedAccounts', followedAccountsObj);
  return Array.isArray(followedAccounts)
    ? { ...followedAccountsObj, LSK: followedAccounts }
    : followedAccounts;
};

export const setFollowedAccountsInLocalStorage = data => localJSONStorage.set('followedAccounts', data);

export const getIndexOfFollowedAccount = (accounts, { address, token = 'LSK' }) =>
  accounts[token].findIndex(account => (account.address === address));
