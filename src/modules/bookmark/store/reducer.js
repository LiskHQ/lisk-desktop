import { getIndexOfBookmark, validateBookmarks, emptyBookmarks } from '@bookmark/utils';
import actionTypes from './actionTypes';

const bookmarks = (state = emptyBookmarks, action) => {
  switch (action.type) {
    case actionTypes.bookmarksRetrieved:
      return validateBookmarks(action.data);
    case actionTypes.bookmarkAdded:
      return {
        ...state,
        [action.data.token]: [
          {
            ...action.data.wallet,
            title: action.data.wallet.title.trim(),
          },
          ...state[action.data.token],
        ],
      };

    case actionTypes.bookmarkUpdated: {
      const { wallet, token } = action.data;
      const tokenBookmarks = state[token];
      const indexOfBookmark = getIndexOfBookmark(state, {
        address: wallet.address,
        token,
      });
      return indexOfBookmark !== -1
        ? {
            ...state,
            [token]: [
              ...tokenBookmarks.slice(0, indexOfBookmark),
              {
                ...tokenBookmarks[indexOfBookmark],
                address: wallet.address,
                title: wallet.title.trim(),
                publicKey: wallet.publicKey,
              },
              ...tokenBookmarks.slice(indexOfBookmark + 1),
            ],
          }
        : state;
    }
    case actionTypes.bookmarkRemoved:
      return {
        ...state,
        [action.data.token]: state[action.data.token].filter(
          (bookmark) => bookmark.address !== action.data.address
        ),
      };
    default:
      return state;
  }
};

export default bookmarks;
