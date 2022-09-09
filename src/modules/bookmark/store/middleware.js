import { setInStorage } from 'src/utils/localJSONStorage';
import actionTypes from './actionTypes';

const bookmarks = (store) => (next) => (action) => {
  switch (action.type) {
    case actionTypes.bookmarkUpdated:
      next(action);
      setInStorage('bookmarks', store.getState().bookmarks);
      break;
    case actionTypes.bookmarkRemoved:
      next(action);
      setInStorage('bookmarks', store.getState().bookmarks);
      break;
    case actionTypes.bookmarkAdded:
      next(action);
      setInStorage('bookmarks', store.getState().bookmarks);
      break;
    default:
      next(action);
      break;
  }
};

export default bookmarks;
