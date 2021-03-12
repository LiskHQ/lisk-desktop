import actionsType from 'constants';
import { setInStorage } from 'utils/localJSONStorage';

const bookmarks = store => next => (action) => {
  switch (action.type) {
    case actionsType.bookmarkUpdated:
      next(action);
      setInStorage('bookmarks', store.getState().bookmarks);
      break;
    case actionsType.bookmarkRemoved:
      next(action);
      setInStorage('bookmarks', store.getState().bookmarks);
      break;
    case actionsType.bookmarkAdded:
      next(action);
      setInStorage('bookmarks', store.getState().bookmarks);
      break;
    default:
      next(action);
      break;
  }
};

export default bookmarks;
