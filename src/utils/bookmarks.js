import localJSONStorage from './localJSONStorage';
import { tokenKeys, tokenMap } from '../constants/tokens';

export const flattenBookmarks = accounts =>
  Object.keys(accounts).reduce((acc, token) =>
    [...acc, ...accounts[token]], []);

export const setBookmarksInLocalStorage = data => localJSONStorage.set('bookmarks', data);

export const getBookmarksFromLocalStorage = () => {
  const bookmarksObj = tokenKeys.reduce((acc, token) => ({ ...acc, [token]: [] }), {});
  const localStorageBookmarks =
    localJSONStorage.get('bookmarks', localJSONStorage.get('followedAccounts', bookmarksObj));
  const bookmarks = Array.isArray(localStorageBookmarks)
    ? { ...bookmarksObj, LSK: localStorageBookmarks }
    : localStorageBookmarks;
  localStorage.removeItem('followedAccounts');
  setBookmarksInLocalStorage(bookmarks);

  return bookmarks;
};

export const getIndexOfBookmark = (accounts, { address, token = tokenMap.LSK.key }) =>
  accounts[token].findIndex(account => (account.address === address));
