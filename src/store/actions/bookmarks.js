import { actionTypes, tokenMap } from '@constants';
import { getFromStorage } from '@utils/localJSONStorage';
import { emptyBookmarks } from '@utils/bookmarks';

/**
 * An action to dispatch settingsRetrieved
 *
 */
export const bookmarksRetrieved = () => (dispatch) => {
  getFromStorage('bookmarks', emptyBookmarks, (data) => {
    dispatch({
      type: actionTypes.bookmarksRetrieved,
      data,
    });
  });
};

export const bookmarkAdded = ({ account, token = tokenMap.LSK.key }) => ({
  data: { account, token },
  type: actionTypes.bookmarkAdded,
});

export const bookmarkUpdated = ({ account, token = tokenMap.LSK.key }) => ({
  data: { account, token },
  type: actionTypes.bookmarkUpdated,
});

export const bookmarkRemoved = ({ address, token = tokenMap.LSK.key }) => ({
  data: { address, token },
  type: actionTypes.bookmarkRemoved,
});
