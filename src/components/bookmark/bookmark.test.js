import React from 'react';
import PropTypes from 'prop-types';
import { mount } from 'enzyme';
import i18n from '../../i18n';
import accounts from '../../../test/constants/accounts';
import Bookmark from './bookmark';

describe('Bookmark Component', () => {
  let wrapper;
  const options = {
    context: { i18n },
    childContextTypes: {
      i18n: PropTypes.object.isRequired,
    },
  };

  const props = {
    address: accounts.genesis.address,
    bookmarks: { LSK: [], BTC: [] },
    balance: accounts.genesis.balance,
    isBookmarked: false,
    bookmarkAdded: jest.fn(),
    bookmarkRemoved: jest.fn(),
    token: 'LSK',
    detailAccount: accounts.genesis,
    t: v => v,
  };

  beforeEach(() => {
    wrapper = mount(<Bookmark {...props} />, options);
  });

  describe('Should render in bookmark and bookmarking states', () => {
    it('Should render in bookmark state', () => {
      const account = { ...accounts.genesis, title: 'bookmark test' };
      const bookmarkProps = {
        ...props,
        isBookmarked: true,
        bookmarks: { LSK: [account], BTC: [] },
      };
      wrapper = mount(<Bookmark {...bookmarkProps} />, options);
      expect(wrapper.find('input[name="accountName"]')).toHaveValue(account.title);
      expect(wrapper.find('button').last()).toHaveText('Remove from bookmarks');
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
      expect(wrapper.find('.fieldInput')).toContainMatchingElement('SpinnerV2.show');
      jest.advanceTimersByTime(300);
      wrapper.update();
      expect(wrapper.find('.fieldInput')).not.toContainMatchingElement('SpinnerV2.show');
      expect(wrapper.find('.fieldInput')).toContainMatchingElement('img.show');
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
      expect(wrapper.find('.feedback')).toHaveClassName('error');
    });
  });
});
