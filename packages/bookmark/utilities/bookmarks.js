import { tokenKeys, tokenMap } from '@constants';

export const emptyBookmarks = tokenKeys.reduce((acc, token) => ({ ...acc, [token]: [] }), {});

/**
 * The bookmarks must be saved as an object whose each member
 * represents an array of accounts saved for a specific token.
 *
 * @param {any} data The bookmarks dictionary
 * @returns {Object} The valid or empty bookmarks dictionary
 */
export const validateBookmarks = (data) => {
  if (!data
    || typeof data !== 'object'
    || !tokenKeys.reduce((flag, token) => flag && Array.isArray(data[token]), true)) {
    return emptyBookmarks;
  }

  return data;
};

export const getIndexOfBookmark = (bookmarks, { address, token = tokenMap.LSK.key }) =>
  bookmarks[token].findIndex(bookmark => (bookmark.address === address));
