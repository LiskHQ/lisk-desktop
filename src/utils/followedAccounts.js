import localJSONStorage from './localJSONStorage';

export const getFollowedAccountsFromLocalStorage = () => localJSONStorage.get('followedAccounts', []);
export const setFollowedAccountsInLocalStorage = accounts => localJSONStorage.set('followedAccounts', accounts);

export const getIndexOfFollowedAccount = (accounts, { publicKey }) =>
  accounts.findIndex(account => (account.publicKey === publicKey));
