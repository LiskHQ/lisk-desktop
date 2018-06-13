import localJSONStorage from './localJSONStorage';
import { extractAddress } from './account';

export const getFollowedAccountsFromLocalStorage = () =>
  localJSONStorage.get('followedAccounts', []).filter(({ publicKey }) => !!extractAddress(publicKey));

export const setFollowedAccountsInLocalStorage = accounts => localJSONStorage.set('followedAccounts', accounts);

export const getIndexOfFollowedAccount = (accounts, { publicKey }) =>
  accounts.findIndex(account => (account.publicKey === publicKey));
