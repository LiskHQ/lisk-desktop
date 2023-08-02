import { mountWithRouterAndStore } from 'src/utils/testHelpers';
import { tokenMap } from '@token/fungible/consts/tokens';
import bookmarks from '@tests/constants/bookmarks';
import EmptyState from '../EmptyState/EmptyState';
import { BookmarksList } from './BookmarksList';

describe('BookmarksList', () => {
  let wrapper;

  const props = {
    history: {
      push: jest.fn(),
    },
    limit: 5,
  };

  const store = {
    token: {
      active: tokenMap.LSK.key,
    },
    bookmarks,
  };

  it('should render EmptyState', () => {
    const updatedStore = {
      ...store,
      bookmarks: {
        LSK: [],
      },
    };
    wrapper = mountWithRouterAndStore(BookmarksList, props, {}, updatedStore);
    expect(wrapper).not.toContainMatchingElement('.bookmark-list-row');
    expect(wrapper).toContainMatchingElement(EmptyState);
  });

  it('should render properly', () => {
    wrapper = mountWithRouterAndStore(BookmarksList, props, {}, store);
    expect(wrapper).toContainMatchingElement('.bookmarks-list');
    expect(wrapper).toContainMatchingElement('.bookmark-list-container');
    expect(wrapper).not.toContainMatchingElement(EmptyState);
  });

  it('should render LSK bookmarks ONLY', () => {
    wrapper = mountWithRouterAndStore(BookmarksList, props, {}, store);
    expect(wrapper).toContainMatchingElement('.bookmark-list-container');
    expect(wrapper).toContainMatchingElements(props.limit, 'a.bookmark-list-row');
  });
});
