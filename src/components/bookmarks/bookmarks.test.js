import { BrowserRouter as Router } from 'react-router-dom';
import React from 'react';
import { mount } from 'enzyme';
import { tokenMap } from '../../constants/tokens';
import Bookmarks from './bookmarks';
import bookmarks from '../../../test/constants/bookmarks';

describe('Bookmarks', () => {
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
  };

  beforeEach(() => {
    wrapper = mount(<Router><Bookmarks {...props} /></Router>);
  });

  it('should render bookmarks list', () => {
    expect(wrapper).toContainMatchingElement('.bookmarks-list');
    expect(wrapper).toContainMatchingElement('.bookmark-list-container');
    expect(wrapper).not.toContainMatchingElement('EmptyState');
  });

  it('should allow filtering bookmarks by title', () => {
    expect(wrapper).toContainMatchingElements(bookmarks.LSK.length, 'a.bookmark-list-row');
    wrapper.find('.bookmarks-filter-input').first().simulate(
      'change',
      { target: { value: bookmarks.LSK[0].title } },
    );
    expect(wrapper).toContainExactlyOneMatchingElement('a.bookmark-list-row');
  });
});
