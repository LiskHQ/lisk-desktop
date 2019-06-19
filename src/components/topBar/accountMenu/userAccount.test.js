import React from 'react';
import { mount } from 'enzyme';
import { MemoryRouter as Router } from 'react-router-dom';
import PropTypes from 'prop-types';
import i18n from '../../../i18n';
import UserAccount from './userAccount';
import routes from '../../../constants/routes';

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

  const history = {
    location: { pathname: routes.dashboard.path },
  };

  const myOptions = {
    context: {
      history, i18n, router: { route: history, history },
    },
    childContextTypes: {
      history: PropTypes.object.isRequired,
      i18n: PropTypes.object.isRequired,
      router: PropTypes.object.isRequired,
    },
  };

  const mountWithRouter = (node, options) => mount(<Router>{node}</Router>, options);

  beforeEach(() => {
    wrapper = mountWithRouter(<UserAccount {...myProps} />, myOptions);
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
    wrapper = mountWithRouter(<UserAccount {...myProps} />, myOptions);
    expect(wrapper).toContainExactlyOneMatchingElement('DropdownV2');
    expect(wrapper).toContainExactlyOneMatchingElement('span.dropdownOption');
    expect(wrapper).toContainMatchingElements(3, 'a.dropdownOption');
  });

  it('called properly onLogout when user click it', () => {
    myProps.isDropdownEnable = true;
    wrapper = mountWithRouter(<UserAccount {...myProps} />, myOptions);
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
    wrapper = mountWithRouter(<UserAccount {...myProps} />, myOptions);
    expect(wrapper.find('DropdownV2')).toContainMatchingElements(1, '.accountInfo');
    wrapper.setProps({
      children: React.cloneElement(wrapper.props().children, {
        account: {
          ...myProps.account,
          info,
        },
      }),
    });
    expect(wrapper.find('DropdownV2')).toContainMatchingElements(2, '.accountInfo');
    localStorage.clear();
  });
});
