import React from 'react';
import { mount } from 'enzyme';
import { BrowserRouter as Router } from 'react-router-dom';
import BookmarksList from './bookmarksList';
import { tokenMap } from '../../constants/tokens';

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
    bookmarks: {
      LSK: [{
        title: 'ABC',
        address: '12345L',
      },
      {
        title: 'FGHDFG',
        address: '12375L',
      },
      {
        title: 'DFGDFG',
        address: '123753453L',
      },
      {
        title: 'FGRT',
        address: '12375345343L',
      },
      {
        title: 'WERER',
        address: '1237534523L',
      },
      {
        title: 'KTG',
        address: '12395L',
      }],
      BTC: [
        {
          title: 'BBTTCC',
          address: '324jhg35hg345',
        },
      ],
    },
  };

  beforeEach(() => {
    wrapper = mount(<Router><BookmarksList {...props} /></Router>);
  });

  it('should render properly', () => {
    expect(wrapper).toContainMatchingElement('.bookmarks-list');
    expect(wrapper).toContainMatchingElement('.bookmark-list-container');
    expect(wrapper).not.toContainMatchingElement('EmptyState');
  });

  it('should render LSK bookmakrs ONLY', () => {
    expect(wrapper).toContainMatchingElement('.bookmark-list-container');
    expect(wrapper).toContainMatchingElements(5, 'a.bookmark-list-row');
  });

  it('should render BTC bookmakrs ONLY', () => {
    wrapper.setProps({
      children: React.cloneElement(wrapper.props().children, {
        token: {
          active: 'BTC',
        },
      }),
    });
    wrapper.update();
    expect(wrapper).toContainMatchingElement('.bookmark-list-container');
    expect(wrapper).toContainMatchingElements(1, 'a.bookmark-list-row');
  });

  it('should render EmptyState', () => {
    wrapper.setProps({
      children: React.cloneElement(wrapper.props().children, {
        bookmarks: {
          LSK: [],
          BTC: [],
        },
      }),
    });
    wrapper.update();
    expect(wrapper).not.toContainMatchingElement('.bookmark-list-row');
    expect(wrapper).toContainMatchingElement('EmptyState');
  });
});
