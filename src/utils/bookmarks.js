import { tokenKeys, tokenMap } from '../constants/tokens';

export const emptyBookmarks = tokenKeys.reduce((acc, token) => ({ ...acc, [token]: [] }), {});

export const validateBookmarks = (data) => {
  if (!!data && typeof data !== 'object') return emptyBookmarks;

  const isValid = tokenKeys.reduce((flag, token) => {
    flag = flag && Array.isArray(data[token]);
    return flag;
  }, true);

  return isValid ? data : emptyBookmarks;
};

export const getIndexOfBookmark = (bookmarks, { address, token = tokenMap.LSK.key }) =>
  bookmarks[token].findIndex(bookmark => (bookmark.address === address));
