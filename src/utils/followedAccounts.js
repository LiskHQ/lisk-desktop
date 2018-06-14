import localJSONStorage from './localJSONStorage';
import regex from './regex';

export const getFollowedAccountsFromLocalStorage = () =>
  localJSONStorage.get('followedAccounts', []).filter(({ address }) => address.match(regex.address));

export const setFollowedAccountsInLocalStorage = accounts => localJSONStorage.set('followedAccounts', accounts);

export const getIndexOfFollowedAccount = (accounts, { address }) =>
  accounts.findIndex(account => (account.address === address));
