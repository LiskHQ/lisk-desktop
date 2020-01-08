import { getIndexOfBookmark, getBookmarksFromLocalStorage } from '../../utils/bookmarks';
import actionTypes from '../../constants/actions';

const bookmarks = (state = getBookmarksFromLocalStorage(), action) => {
  switch (action.type) {
    case actionTypes.bookmarkAdded:
      return {
        ...state,
        [action.data.token]: [
          {
            ...action.data.account,
          },
          ...state[action.data.token],
        ],
      };

    case actionTypes.bookmarkUpdated: {
      const { account, token } = action.data;
      const tokenBookmarks = state[token];
      const indexOfBookmark = getIndexOfBookmark(state, {
        address: account.address,
        token,
      });
      return (indexOfBookmark !== -1
        ? ({
          ...state,
          [token]: [
            ...tokenBookmarks.slice(0, indexOfBookmark),
            {
              ...tokenBookmarks[indexOfBookmark],
              address: account.address,
              title: account.title,
              publicKey: account.publicKey,
            },
            ...tokenBookmarks.slice(indexOfBookmark + 1),
          ],
        }) : state);
    }
    case actionTypes.bookmarkRemoved:
      return {
        ...state,
        [action.data.token]:
          state[action.data.token].filter(bookmark => bookmark.address !== action.data.address),
      };
    default:
      return state;
  }
};

export default bookmarks;
