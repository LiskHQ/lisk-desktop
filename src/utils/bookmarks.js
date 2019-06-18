import localJSONStorage from './localJSONStorage';
import { tokenKeys, tokenMap } from '../constants/tokens';

export const flattenBookmarks = bookmarks =>
  Object.keys(bookmarks).reduce((acc, token) =>
    [...acc, ...bookmarks[token]], []);

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

export const getIndexOfBookmark = (bookmarks, { address, token = tokenMap.LSK.key }) =>
  bookmarks[token].findIndex(bookmark => (bookmark.address === address));
