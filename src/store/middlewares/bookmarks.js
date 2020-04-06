import actionsType from '../../constants/actions';
import { setInStorage } from '../../utils/localJSONStorage';

const bookmarks = store => next => (action) => {
  switch (action.type) {
    case actionsType.bookmarkUpdated:
    case actionsType.bookmarkRemoved:
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
