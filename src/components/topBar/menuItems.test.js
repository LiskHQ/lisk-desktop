import React from 'react';
import { expect } from 'chai';
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
    expect(wrapper.find('.wrapper')).to.have.length(1);
  });

  it('renders 3 menu items elements', () => {
    expect(wrapper.find('Link')).to.have.length(3);
    expect(wrapper.find('span').at(0)).to.have.text('Dashboard');
    expect(wrapper.find('span').at(1)).to.have.text('My Wallet');
    expect(wrapper.find('span').at(2)).to.have.text('Delegates');
  });

  it('renders 3 menu items but only Dashboard is enabled as user is logout', () => {
    myProps.isUserLogout = true;
    wrapper = mountWithRouter(<MenuItems {...myProps} />, myOptions);

    expect(wrapper.find('Link')).to.have.length(3);
    expect(wrapper.find('#dashboard').at(0).hasClass('notActive')).to.equal(false);
    expect(wrapper.find('#transactions').at(0).hasClass('notActive')).to.equal(true);
    expect(wrapper.find('#delegates').at(0).hasClass('notActive')).to.equal(true);
  });
});
