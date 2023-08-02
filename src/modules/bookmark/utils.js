import { tokenKeys, tokenMap } from '@token/fungible/consts/tokens';
import { validateAddress } from 'src/utils/validators';
import { regex } from 'src/const/regex';

export const emptyBookmarks = tokenKeys.reduce((acc, token) => ({ ...acc, [token]: [] }), {});

/**
 * The bookmarks must be saved as an object where each member
 * represents an array of accounts saved for a specific token.
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

export const getIndexOfLabel = (bookmarks, { label, token = tokenMap.LSK.key }) =>
  bookmarks[token].findIndex((item) => item.title.toLowerCase() === label.toLowerCase());

/**
 *  Checks the label and returns feedback
 * @returns {String} - Feedback string. Empty string if the label is valid
 */
export const validateBookmarkLabel = (token, value = '', bookmarks, t) => {
  if (!value) return '';
  if (!value.match(regex.accountName)) {
    return t('Label can be alphanumeric with either !,@,$,&,_,. as special characters.');
  }
  if (value.length < 3) {
    return t('Label is too short, Min. 3 characters.');
  }
  if (value.length > 20) {
    return t('Label is too long, Max. 20 characters.');
  }
  if (getIndexOfLabel(bookmarks, { label: value, token }) !== -1) {
    return t(`Bookmark with name "${value}" already exists.`);
  }
  return '';
};

/**
 * Checks the address and returns feedback
 * @returns {String} - Feedback string. Empty string if the address is valid (and unique)
 */
export const validateBookmarkAddress = (token, value = '', bookmarks, t, isUnique) => {
  if (validateAddress(value) === 1) {
    return t('Invalid address');
  }
  if (isUnique && getIndexOfBookmark(bookmarks, { address: value, token }) !== -1) {
    return t('Address already bookmarked');
  }
  return '';
};
