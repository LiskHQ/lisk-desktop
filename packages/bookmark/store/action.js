import { tokenMap } from '@token/configuration/tokens';
import { getFromStorage } from '@common/utilities/localJSONStorage';
import { emptyBookmarks } from '@bookmark/utilities/bookmarks';
import { validateAddress } from '@common/utilities/validators';
import actionTypes from './actionTypes';

/**
 * An action to dispatch settingsRetrieved
 */
export const bookmarksRetrieved = () => (dispatch) => {
  getFromStorage('bookmarks', emptyBookmarks, (data) => {
    const bookmarks = {
      BTC: data.BTC,
      LSK: data.LSK.map(account => ({
        ...account,
        disabled: validateAddress('LSK', account.address) === 1,
      })),
    };
    dispatch({
      type: actionTypes.bookmarksRetrieved,
      data: bookmarks,
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
