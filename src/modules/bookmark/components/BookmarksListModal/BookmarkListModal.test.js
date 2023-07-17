import { tokenMap } from '@token/fungible/consts/tokens';
import { mountWithRouterAndStore } from 'src/utils/testHelpers';
import bookmarks from '@tests/constants/bookmarks';
import BookmarkListModal from './BookmarkListModal';

describe('BookmarkListModal', () => {
  let wrapper;
  let props;

  const store = {
    token: {
      active: tokenMap.LSK.key,
    },
    bookmarks,
  };

  beforeEach(() => {
    props = {
      t: (v) => v,
      history: {
        push: jest.fn(),
      },
      bookmarkRemoved: jest.fn(),
      bookmarkUpdated: jest.fn(),
    };
    wrapper = mountWithRouterAndStore(BookmarkListModal, props, {}, store);
  });

  it('should render bookmarks list', () => {
    expect(wrapper).toContainMatchingElement('.bookmarks-list');
    expect(wrapper).toContainMatchingElement('.bookmark-list-container');
    expect(wrapper).not.toContainMatchingElement('EmptyState');
  });

  it('should allow filtering bookmarks by title', () => {
    expect(wrapper).toContainMatchingElements(bookmarks.LSK.length, 'a.bookmark-list-row');
    wrapper
      .find('input.bookmarks-filter-input')
      .simulate('change', { target: { value: bookmarks.LSK[0].title } });
    expect(wrapper).toContainExactlyOneMatchingElement('a.bookmark-list-row');
  });

  it('should show filtering empty state if no bookmark matches', () => {
    wrapper
      .find('input.bookmarks-filter-input')
      .simulate('change', { target: { value: 'some random text' } });
    expect(wrapper).toContainExactlyOneMatchingElement('img.bookmark-empty-filter-illustration');
  });

  it('should allow deleting a bookmark', () => {
    expect(wrapper).toContainMatchingElements(bookmarks.LSK.length, 'a.bookmark-list-row');
    wrapper.find('.bookmarks-delete-button').first().simulate('click');
    expect(props.bookmarkRemoved).toHaveBeenCalledWith({
      address: bookmarks.LSK[0].address,
      token: store.token.active,
    });
  });

  it('should allow editing a bookmark title', () => {
    const newTitle = 'New title';
    expect(wrapper).toContainMatchingElements(bookmarks.LSK.length, 'a.bookmark-list-row');
    wrapper.find('.bookmarks-edit-button').first().simulate('click');
    jest.runOnlyPendingTimers();
    wrapper.find('input.bookmarks-edit-input').simulate('change', { target: { value: newTitle } });
    wrapper.find('.bookmarks-save-changes-button').first().simulate('click');
    expect(props.bookmarkUpdated).toHaveBeenCalledWith({
      wallet: {
        address: bookmarks.LSK[0].address,
        title: newTitle,
      },
      token: store.token.active,
    });
    expect(wrapper).not.toContainMatchingElement('.bookmarks-edit-input');
  });

  it('should allow to cancel editing a bookmark title', () => {
    const newTitle = 'New title';
    expect(wrapper).toContainMatchingElements(bookmarks.LSK.length, 'a.bookmark-list-row');
    wrapper.find('.bookmarks-edit-button').first().simulate('click');
    jest.runOnlyPendingTimers();
    wrapper.find('input.bookmarks-edit-input').simulate('change', { target: { value: newTitle } });
    wrapper.find('.bookmarks-cancel-button').first().simulate('click');
    expect(props.bookmarkUpdated).not.toHaveBeenCalledWith({
      wallet: {
        address: bookmarks.LSK[0].address,
        title: newTitle,
      },
      token: store.token.active,
    });
    expect(wrapper).not.toContainMatchingElement('.bookmarks-edit-input');
  });
});
