import React from 'react';
import { mount } from 'enzyme';
import accounts from '../../../../../test/constants/accounts';
import BookmarkDropdown from './bookmarkDropdown';

describe('Bookmark Component', () => {
  let wrapper;

  const props = {
    address: accounts.genesis.address,
    bookmarks: { LSK: [], BTC: [] },
    balance: accounts.genesis.balance,
    isBookmark: false,
    bookmarkAdded: jest.fn(),
    bookmarkRemoved: jest.fn(),
    token: 'LSK',
    publicKey: accounts.genesis.publicKey,
    t: v => v,
  };

  beforeEach(() => {
    wrapper = mount(<BookmarkDropdown {...props} />);
  });

  describe('Should render in bookmark and bookmarking states', () => {
    it('Should render in bookmark state', () => {
      const account = { ...accounts.genesis, title: 'bookmark test' };
      const bookmarkProps = {
        ...props,
        isBookmark: true,
        bookmarks: { LSK: [account], BTC: [] },
      };
      wrapper = mount(<BookmarkDropdown {...bookmarkProps} />);
      expect(wrapper.find('input[name="accountName"]')).toHaveValue(account.title);
      expect(wrapper.find('button').last()).toHaveText('Remove bookmark');
      wrapper.find('button').last().simulate('click');
      expect(props.bookmarkRemoved).toBeCalledWith({
        address: account.address,
        token: props.token,
      });
    });

    it('Should render in bookmark state', () => {
      expect(wrapper.find('input[name="accountName"]')).not.toHaveValue();
      expect(wrapper.find('button').last()).toHaveText('Confirm');
    });
  });

  describe('Handle account name input changes', () => {
    it('Should validate to true if name is valid', () => {
      const evt = { target: { name: 'accountName', value: 'test name' } };
      const expected = {
        account: {
          address: props.address,
          title: evt.target.value,
          isDelegate: false,
          publicKey: accounts.genesis.publicKey,
        },
        token: props.token,
      };
      wrapper.find('input[name="accountName"]').simulate('change', evt);
      expect(wrapper.find('.account-title')).toContainMatchingElement('Spinner');
      jest.advanceTimersByTime(300);
      wrapper.update();
      expect(wrapper.find('.account-title')).not.toContainMatchingElement('Spinner');
      expect(wrapper.find('.account-title')).toContainMatchingElement('img.status');
      expect(wrapper.find('button').last()).not.toBeDisabled();
      wrapper.find('button').last().simulate('click');
      expect(props.bookmarkAdded).toBeCalledWith(expected);
    });

    it('Should show error if account name to long', () => {
      const evt = { target: { name: 'accountName', value: 'following name too long' } };
      wrapper.find('input[name="accountName"]').simulate('change', evt);
      wrapper.update();
      jest.advanceTimersByTime(300);
      wrapper.update();
      expect(wrapper.find('button').last()).toBeDisabled();
      expect(wrapper.find('.account-title .feedback.error').first()).toHaveClassName('error');
    });
  });
});
