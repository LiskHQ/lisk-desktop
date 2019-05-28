import localJSONStorage from './localJSONStorage';
import { tokenKeys } from '../constants/tokens';

export const flattenBookmarks = accounts =>
  Object.keys(accounts).reduce((acc, token) =>
    [...acc, ...accounts[token]], []);

export const getBookmarksFromLocalStorage = () => {
  const bookmarksObj = tokenKeys.reduce((acc, token) => ({ ...acc, [token]: [] }), {});
  const bookmarks = localJSONStorage.get('bookmarks', bookmarksObj);
  return Array.isArray(bookmarks)
    ? { ...bookmarksObj, LSK: bookmarks }
    : bookmarks;
};

export const setBookmarksInLocalStorage = data => localJSONStorage.set('bookmarks', data);

export const getIndexOfBookmark = (accounts, { address, token = 'LSK' }) =>
  accounts[token].findIndex(account => (account.address === address));
