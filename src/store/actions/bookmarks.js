import { actionTypes, tokenMap } from '@constants';
import { getFromStorage } from '@utils/localJSONStorage';
import { emptyBookmarks } from '@utils/bookmarks';
import { validateAddress } from '@utils/validators';

/**
 * An action to dispatch settingsRetrieved
 */
export const bookmarksRetrieved = () => (dispatch) => {
  getFromStorage('bookmarks', emptyBookmarks, (data) => {
    // if legacy address, disable it
    // @todo This is a quick fix and we have to fetch the
    // legacy account and replace it with the new address
    // after Lisk Service implements this feature.
    const bookmarks = {
      BTC: data.BTC,
      LSK: data.LSK.map(account => ({
        ...account,
        disabled: !validateAddress('LSK', account.address),
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
