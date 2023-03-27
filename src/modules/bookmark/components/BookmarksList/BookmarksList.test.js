import React from 'react';
import { mount } from 'enzyme';
import { tokenMap } from '@token/fungible/consts/tokens';
import EmptyState from 'src/theme/box/emptyState';
import bookmarks from '@tests/constants/bookmarks';
import { BookmarksList } from './BookmarksList';

describe('BookmarksList', () => {
  let wrapper;

  const props = {
    t: (v) => v,
    history: {
      push: jest.fn(),
    },
    token: {
      active: tokenMap.LSK.key,
    },
    bookmarks,
    limit: 5,
  };

  beforeEach(() => {
    wrapper = mount(<BookmarksList {...props} />);
  });

  it('should render properly', () => {
    expect(wrapper).toContainMatchingElement('.bookmarks-list');
    expect(wrapper).toContainMatchingElement('.bookmark-list-container');
    expect(wrapper).not.toContainMatchingElement(EmptyState);
  });

  it('should render LSK bookmarks ONLY', () => {
    expect(wrapper).toContainMatchingElement('.bookmark-list-container');
    expect(wrapper).toContainMatchingElements(props.limit, 'a.bookmark-list-row');
  });

  it('should render EmptyState', () => {
    wrapper.setProps({
      bookmarks: {
        LSK: [],
      },
    });
    wrapper.update();
    expect(wrapper).not.toContainMatchingElement('.bookmark-list-row');
    expect(wrapper).toContainMatchingElement(EmptyState);
  });
});
