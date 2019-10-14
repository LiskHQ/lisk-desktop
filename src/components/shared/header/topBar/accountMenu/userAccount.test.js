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

  beforeEach(() => {
    wrapper = mount(<UserAccount {...myProps} />);
  });

  it('renders <UserAccount /> component', () => {
    expect(wrapper).toContainMatchingElement('.user-account');
  });

  it('called properly dropdown component', () => {
    myProps.isDropdownEnable = true;
    wrapper = mount(<UserAccount {...myProps} />);
    expect(wrapper).toContainExactlyOneMatchingElement('Dropdown');
    expect(wrapper).toContainExactlyOneMatchingElement('span.dropdownOption');
    expect(wrapper).toContainMatchingElements(4, 'a.dropdownOption');
  });

  it('called properly onLogout when user click it', () => {
    myProps.isDropdownEnable = true;
    wrapper = mount(<UserAccount {...myProps} />);
    wrapper.find('span.dropdownOption').simulate('click');
    expect(myProps.onLogout).toHaveBeenCalled();
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
