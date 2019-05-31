import { getIndexOfBookmark, getBookmarksFromLocalStorage } from '../../utils/bookmarks';
import actionTypes from '../../constants/actions';

const bookmarks = (state = getBookmarksFromLocalStorage(), action) => {
  switch (action.type) {
    case actionTypes.bookmarkAdded:
      return {
        ...state,
        [action.data.token]: [
          ...state[action.data.token],
          {
            ...action.data.account,
          },
        ],
      };

    case actionTypes.bookmarkUpdated: {
      const indexOfAccount = getIndexOfBookmark(state, {
        address: action.data.account.address,
        token: action.data.token,
      });
      const accounts = state[action.data.token];
      if (indexOfAccount !== -1) {
        const changedAccount = {
          ...accounts[indexOfAccount],
          address: action.data.account.address,
          title: action.data.account.title,
          publicKey: action.data.account.publicKey,
        };
        accounts[indexOfAccount] = changedAccount;
      }

      return {
        ...state,
        [action.data.token]: accounts,
      };
    }
    case actionTypes.bookmarkRemoved:
      return {
        ...state,
        [action.data.token]:
          state[action.data.token].filter(account => !(account.address === action.data.address)),
      };

    default:
      return state;
  }
};

export default bookmarks;
