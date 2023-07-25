import { tokenMap } from '@token/fungible/consts/tokens';
import { smartRender } from 'src/utils/testHelpers';
import bookmarks from '@tests/constants/bookmarks';
import { removeSearchParamsFromUrl, addSearchParamsToUrl } from 'src/utils/searchParams';
import BookmarkListModal from './BookmarkListModal';

jest.mock('src/utils/searchParams', () => ({
  removeSearchParamsFromUrl: jest.fn(),
  addSearchParamsToUrl: jest.fn(),
}));

describe('BookmarkListModal', () => {
  let wrapper;
  let props;

  const storeInfo = {
    token: {
      active: tokenMap.LSK.key,
    },
    bookmarks,
  };

  const config = {
    renderType: 'mount',
    store: true,
    storeInfo,
  };

  beforeEach(() => {
    props = {
      t: (v) => v,
      bookmarkRemoved: jest.fn(),
      bookmarkUpdated: jest.fn(),
    };
    wrapper = smartRender(BookmarkListModal, props, config).wrapper;
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
      token: storeInfo.token.active,
    });
  });

  it('should allow editing a bookmark title', () => {
    const newTitle = 'new_title';
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
      token: storeInfo.token.active,
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
      token: storeInfo.token.active,
    });
    expect(wrapper).not.toContainMatchingElement('.bookmarks-edit-input');
  });

  it('should allow adding a new bookmark', () => {
    expect(wrapper).toContainMatchingElements(bookmarks.LSK.length, 'a.bookmark-list-row');
    wrapper.find('button').first().simulate('click');
    expect(removeSearchParamsFromUrl).toHaveBeenCalledTimes(1);
    expect(removeSearchParamsFromUrl).toHaveBeenCalledWith(
      expect.objectContaining({ push: expect.any(Function) }),
      ['modal']
    );
    expect(addSearchParamsToUrl).toHaveBeenCalledTimes(1);
    expect(addSearchParamsToUrl).toHaveBeenCalledWith(
      expect.objectContaining({ push: expect.any(Function) }),
      { modal: 'addBookmark' }
    );
  });
});
