import localJSONStorage from './localJSONStorage';
import regex from './regex';

export const getFollowedAccountsFromLocalStorage = () => {
  const accounts = localJSONStorage.get('followedAccounts', []);
  const accountsArray = Array.isArray(accounts) ? accounts : [];
  return accountsArray.filter(({ address }) => address.match(regex.address));
};

export const setFollowedAccountsInLocalStorage = accounts => localJSONStorage.set('followedAccounts', accounts);

export const getIndexOfFollowedAccount = (accounts, { address }) => accounts.findIndex(
  account => (account.address === address),
);
