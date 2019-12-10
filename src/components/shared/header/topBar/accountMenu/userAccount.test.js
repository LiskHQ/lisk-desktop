import React from 'react';
import { mount } from 'enzyme';
import UserAccount from './userAccount';

describe('UserAccount', () => {
  let wrapper;

  const myProps = {
    token: {
      active: 'LSK',
      list: {
        BTC: true,
        LSK: true,
      },
    },
    account: {
      info: {
        LSK: {
          address: '12345L',
          balance: 120,
        },
      },
    },
    isDropdownEnable: false,
    onDropdownToggle: jest.fn(),
    onLogout: jest.fn(),
    settingsUpdated: jest.fn(),
    setDropdownRef: () => {},
    t: val => val,
  };

  it('renders <UserAccount /> component', () => {
    wrapper = mount(<UserAccount {...myProps} />);
    expect(wrapper).toContainMatchingElement('.user-account');
  });

  it('renders 4 menu items', () => {
    myProps.isDropdownEnable = true;
    wrapper = mount(<UserAccount {...myProps} />);
    expect(wrapper).toContainExactlyOneMatchingElement('Dropdown');
    expect(wrapper).toContainExactlyOneMatchingElement('span.dropdownOption');
    expect(wrapper).toContainMatchingElements(4, 'a.dropdownOption');
  });

  it('renders the sign message option if signed in using passphrase', () => {
    myProps.isDropdownEnable = true;
    const account = {
      info: {
        LSK: {},
      },
      loginType: 0,
    };
    const signedInProps = { ...myProps, account };
    wrapper = mount(<UserAccount {...signedInProps} />);
    expect(wrapper.find('#signMessage').exists()).toEqual(true);
  });

  it('renders the no sign message option if signed in using HW', () => {
    myProps.isDropdownEnable = true;
    const account = {
      info: {
        LSK: {},
      },
      loginType: 1,
    };
    const signedInProps = { ...myProps, account };
    wrapper = mount(<UserAccount {...signedInProps} />);
    expect(wrapper.find('#signMessage').exists()).toEqual(false);
  });

  it('should not render if no info in accounts', () => {
    const info = {
      ...myProps.account.info,
      BTC: {
        address: '12345L',
        balance: 120,
      },
    };
    localStorage.setItem('btc', true);
    wrapper = mount(<UserAccount {...myProps} />);
    expect(wrapper.find('Dropdown')).toContainMatchingElements(1, '.accountInfo');
    wrapper.setProps({
      account: {
        ...myProps.account,
        info,
      },
    });
    expect(wrapper.find('Dropdown')).toContainMatchingElements(2, '.accountInfo');
    localStorage.clear();
  });

  it('should called settingsUpdate when a token is selected', () => {
    wrapper = mount(<UserAccount {...myProps} />);
    wrapper.find('button.user-account').simulate('click');
    wrapper.find('span.token').at(0).simulate('click');
    expect(myProps.settingsUpdated).toHaveBeenCalled();
  });
});
