import React from 'react';
import { mount } from 'enzyme';
import { tokenMap } from '@token/configuration/tokens';
import EmptyState from '@basics/box/emptyState';
import { BookmarksList } from './list';
import bookmarks from '@tests/constants/bookmarks';

describe('BookmarksList', () => {
  let wrapper;

  const props = {
    t: v => v,
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

  it('should render LSK bookmakrs ONLY', () => {
    expect(wrapper).toContainMatchingElement('.bookmark-list-container');
    expect(wrapper).toContainMatchingElements(props.limit, 'a.bookmark-list-row');
  });

  it('should render BTC bookmakrs ONLY', () => {
    wrapper.setProps({
      token: {
        active: 'BTC',
      },
    });
    wrapper.update();
    expect(wrapper).toContainMatchingElement('.bookmark-list-container');
    expect(wrapper).toContainMatchingElements(1, 'a.bookmark-list-row');
  });

  it('should render EmptyState', () => {
    wrapper.setProps({
      bookmarks: {
        LSK: [],
        BTC: [],
      },
    });
    wrapper.update();
    expect(wrapper).not.toContainMatchingElement('.bookmark-list-row');
    expect(wrapper).toContainMatchingElement(EmptyState);
  });
});
