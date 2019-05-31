import { setBookmarksInLocalStorage } from '../../utils/bookmarks';

const bookmarksSubscriber = (store) => {
  const { bookmarks } = store.getState();
  setBookmarksInLocalStorage(bookmarks);
};

export default bookmarksSubscriber;
