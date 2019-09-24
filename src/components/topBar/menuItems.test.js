import React from 'react';
import { mount } from 'enzyme';
import { MemoryRouter as Router } from 'react-router-dom';
import PropTypes from 'prop-types';
import i18n from '../../i18n';
import MenuItems from './menuItems';
import menuLinks from './constants';
import routes from '../../constants/routes';

describe('MenuItems', () => {
  let wrapper;

  const myProps = {
    token: {
      active: 'LSK',
      list: {
        LSK: true,
        BTC: true,
      },
    },
    isUserLogout: false,
    items: menuLinks(v => v),
    location: {
      pathname: routes.dashboard.path,
    },
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
    wrapper = mountWithRouter(<MenuItems {...myProps} />, myOptions);
  });

  it('renders <MenuItems /> component', () => {
    expect(wrapper).toContainExactlyOneMatchingElement('.wrapper');
  });

  it('renders 3 menu items elements', () => {
    const expectedLinks = [
      'Dashboard',
      'Wallet',
      'Delegates',
    ];
    expect(wrapper).toContainMatchingElements(3, 'a');
    wrapper.find('a').forEach((link, index) => expect(link).toHaveText(expectedLinks[index]));
  });

  it('renders 3 menu items but only Dashboard is enabled as user is logout', () => {
    myProps.isUserLogout = true;
    wrapper = mountWithRouter(<MenuItems {...myProps} />, myOptions);

    expect(wrapper).toContainMatchingElements(3, 'a');
    expect(wrapper).toContainExactlyOneMatchingElement('a.notActive');
    expect(wrapper.find('a').at(0)).not.toHaveClassName('notActive');
    expect(wrapper.find('a').at(1)).toHaveClassName('notActive');
    expect(wrapper.find('a').at(2)).not.toHaveClassName('notActive');
  });
});
