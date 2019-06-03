import React from 'react';
import { mount } from 'enzyme';
import { BrowserRouter as Router } from 'react-router-dom';
import BookmarksList from './bookmarksList';
import { tokenMap } from '../../constants/tokens';
// import keyCodes from './../../constants/keyCodes';

describe('BookmarksList', () => {
  let wrapper;

  const props = {
    t: v => v,
    history: {
      push: jest.fn(),
    },
    token: {
      active: tokenMap.LSK.key,
      list: {
        LSK: true,
        BTC: true,
      },
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
    expect(wrapper).toContainMatchingElement('Tabs');
    expect(wrapper).toContainMatchingElement('.bookmark-list-container');
    expect(wrapper).not.toContainMatchingElement('EmptyState');
  });

  it('should render LSK bookmakrs ONLY', () => {
    expect(wrapper).toContainMatchingElement('.bookmark-list-container');
    expect(wrapper).toContainMatchingElements(5, '.bookmark-list-row');
  });

  it('should render BTC bookmakrs ONLY', () => {
    wrapper.find('.tab-bitcoin').at(0).simulate('click');
    expect(wrapper).toContainMatchingElement('.bookmark-list-container');
    expect(wrapper).toContainMatchingElements(1, '.bookmark-list-row');
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

  // it('render properly when bookmard is selected', () => {
  //   props.recipient.address = '12345L';
  //   props.recipient.title = 'John Cena';
  //   props.recipient.balance = '10';
  //   wrapper = mount(<Bookmark {...props} />, options);
  //   expect(wrapper).toContainMatchingElement('AccountVisual');
  // });

  // it('should select an account from the available list', () => {
  //   props.showSuggestions = true;
  //   props.recipient.value = 'L';
  //   wrapper = mount(<Bookmark {...props} />, options);
  //   expect(wrapper).toContainMatchingElement('.bookmark-list');
  //   expect(wrapper).toContainMatchingElements(3, 'li');
  //   wrapper.find('InputV2.input').simulate('keyDown', { keyCode: keyCodes.arrowDown });
  //   wrapper.find('InputV2.input').simulate('keyDown', { keyCode: keyCodes.arrowUp });
  //   wrapper.find('InputV2.input').simulate('keyDown', { keyCode: keyCodes.enter });
  //   wrapper.find('.bookmark-list li').at(0).simulate('click');
  //   expect(props.onSelectedAccount).toBeCalled();
  // });
});
