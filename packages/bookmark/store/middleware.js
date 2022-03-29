import actionTypes from './actionTypes';
import { setInStorage } from '@common/utilities/localJSONStorage';

const bookmarks = store => next => (action) => {
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
