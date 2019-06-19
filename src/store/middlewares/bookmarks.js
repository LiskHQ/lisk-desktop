import actionsType from '../../constants/actions';
import { setBookmarksInLocalStorage } from '../../utils/bookmarks';

const bookmarks = store => next => (action) => {
  switch (action.type) {
    case actionsType.bookmarkUpdated:
    case actionsType.bookmarkRemoved:
    case actionsType.bookmarkAdded:
      next(action);
      setBookmarksInLocalStorage(store.getState().bookmarks);
      break;
    default:
      next(action);
      break;
  }
};

export default bookmarks;
