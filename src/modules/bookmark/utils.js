import { tokenKeys, tokenMap } from '@token/fungible/consts/tokens';
import { validateAddress } from 'src/utils/validators';
import { parseSearchParams } from 'src/utils/searchParams';

export const emptyBookmarks = tokenKeys.reduce((acc, token) => ({ ...acc, [token]: [] }), {});

/**
 * The bookmarks must be saved as an object whose each member
 * represents an array of accounts saved for a specific token.
 *
 * @param {any} data The bookmarks dictionary
 * @returns {Object} The valid or empty bookmarks dictionary
 */
export const validateBookmarks = (data) => {
  if (
    !data ||
    typeof data !== 'object' ||
    !tokenKeys.reduce((flag, token) => flag && Array.isArray(data[token]), true)
  ) {
    return emptyBookmarks;
  }

  return data;
};

export const getIndexOfBookmark = (bookmarks, { address, token = tokenMap.LSK.key }) =>
  bookmarks[token].findIndex((bookmark) => bookmark.address === address);

/**
 *  Checks the label and returns feedback
 *
 * @param {String} value - The label string to check
 * @param {Function} t - i18n function
 * @returns {String} - Feedback string. Empty string if the label is valid
 */
export const validateBookmarkLabel = (value = '', t) => {
  if (value.length > 20) {
    return t('Label is too long, Max. 20 characters');
  }
  return '';
};

/**
 * Checks the address and returns feedback
 *
 * @param {String} token - LSK or any other token
 * @param {String} value - Address string
 * @param {Object} network - The network object from Redux store
 * @param {Object} bookmarks - Lisk of bookmarks from Redux store
 * @param {Function} t - i18n function
 * @param {Boolean} isUnique - Should check if the account is already a bookmark
 * @returns {String} - Feedback string. Empty string if the address is valid (and unique)
 */
export const validateBookmarkAddress = (token, value = '', network, bookmarks, t, isUnique) => {
  if (validateAddress(value) === 1) {
    return t('Invalid address');
  }
  if (isUnique && getIndexOfBookmark(bookmarks, { address: value, token }) !== -1) {
    return t('Address already bookmarked');
  }
  return '';
};

/**
 * Define edit/add mode
 *
 * @param {Object} history - History object from withRouter
 * @param {Object} bookmarks - Lisk of bookmarks from Redux store
 * @param {String} active - LSK, etc
 * @returns {String} - edit or add
 */
export const getBookmarkMode = (history, bookmarks, active) => {
  const { address } = parseSearchParams(history.location.search);
  return bookmarks[active].some((bookmark) => bookmark.address === address) ? 'edit' : 'add';
};
