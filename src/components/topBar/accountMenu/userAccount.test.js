import React from 'react';
import { mount } from 'enzyme';
import { MemoryRouter as Router } from 'react-router-dom';
import PropTypes from 'prop-types';
import UserAccount from './userAccount';
import store from '../../../store';

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

  const options = {
    context: { store },
    childContextTypes: { store: PropTypes.object.isRequired },
  };

  const mountWithRouter = (node, storeOptions) => mount(<Router>{node}</Router>, storeOptions);

  beforeEach(() => {
    wrapper = mountWithRouter(<UserAccount {...myProps} />, options);
  });

  it('renders <UserAccount /> component', () => {
    expect(wrapper).toContainMatchingElement('.user-account');
  });

  it('called properly onDropdownToggle when user click it', () => {
    wrapper.find('div.user-account').simulate('click');
    expect(myProps.onDropdownToggle).toHaveBeenCalled();
  });

  it('called properly dropdown component', () => {
    myProps.isDropdownEnable = true;
    wrapper = mountWithRouter(<UserAccount {...myProps} />, options);
    expect(wrapper).toContainExactlyOneMatchingElement('Dropdown');
    expect(wrapper).toContainExactlyOneMatchingElement('span.dropdownOption');
    expect(wrapper).toContainMatchingElements(4, 'a.dropdownOption');
  });

  it('called properly onLogout when user click it', () => {
    myProps.isDropdownEnable = true;
    wrapper = mountWithRouter(<UserAccount {...myProps} />, options);
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
    wrapper = mountWithRouter(<UserAccount {...myProps} />, options);
    expect(wrapper.find('Dropdown')).toContainMatchingElements(1, '.accountInfo');
    wrapper.setProps({
      children: React.cloneElement(wrapper.props().children, {
        account: {
          ...myProps.account,
          info,
        },
      }),
    });
    expect(wrapper.find('Dropdown')).toContainMatchingElements(2, '.accountInfo');
    localStorage.clear();
  });
});
