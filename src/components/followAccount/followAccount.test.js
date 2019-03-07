import React from 'react';
import PropTypes from 'prop-types';
import { mount } from 'enzyme';
import i18n from '../../i18n';
import accounts from '../../../test/constants/accounts';
import FollowAccount from './followAccount';

describe('Follow Account Component', () => {
  let wrapper;
  const options = {
    context: { i18n },
    childContextTypes: {
      i18n: PropTypes.object.isRequired,
    },
  };

  const props = {
    address: accounts.genesis.address,
    accounts: [],
    balance: accounts.genesis.balance,
    isFollowing: false,
    addAccount: jest.fn(),
    removeAccount: jest.fn(),
  };

  beforeEach(() => {
    wrapper = mount(<FollowAccount {...props} />, options);
  });

  describe('Should render in follow and following states', () => {
    it('Should render in following state', () => {
      const account = { ...accounts.genesis, title: 'follow test' };
      const followingProps = {
        ...props,
        isFollowing: true,
        accounts: [account],
      };
      wrapper = mount(<FollowAccount {...followingProps} />, options);
      expect(wrapper.find('input[name="accountName"]')).toHaveValue(account.title);
      expect(wrapper.find('button').last()).toHaveText('Unfollow');
      wrapper.find('button').last().simulate('click');
      expect(props.removeAccount).toBeCalledWith(account);
    });

    it('Should render in follow state', () => {
      expect(wrapper.find('input[name="accountName"]')).not.toHaveValue();
      expect(wrapper.find('button').last()).toHaveText('Confirm');
    });
  });

  describe('Handle account name input changes', () => {
    it('Should validate to true if name is valid', () => {
      const evt = { target: { name: 'accountName', value: 'test name' } };
      const expected = {
        address: props.address,
        balance: props.balance,
        title: evt.target.value,
      };
      wrapper.find('input[name="accountName"]').simulate('change', evt);
      expect(wrapper.find('.fieldInput')).toContainMatchingElement('SpinnerV2.show');
      jest.advanceTimersByTime(300);
      wrapper.update();
      expect(wrapper.find('.fieldInput')).not.toContainMatchingElement('SpinnerV2.show');
      expect(wrapper.find('.fieldInput')).toContainMatchingElement('img.show');
      expect(wrapper.find('button').last()).not.toBeDisabled();
      wrapper.find('button').last().simulate('click');
      expect(props.addAccount).toBeCalledWith(expected);
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
