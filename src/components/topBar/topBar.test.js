import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import sinon from 'sinon';
import PropTypes from 'prop-types';
import i18n from '../../i18n';
import TopBar from './topBar';
import routes from '../../constants/routes';

describe('TopBar', () => {
  let wrapper;

  const myProps = {
    account: {
      address: '12345L',
      balance: 120,
    },
    setActiveDialog: sinon.spy(),
    location: { pathname: routes.dashboard.path },
    showDelegate: false,
    t: val => val,
    logOut: sinon.spy(),
    history: {
      replace: () => {},
    },
  };

  const history = {
    location: { pathname: routes.dashboard.path },
    createHref: () => {},
  };

  const store = configureStore({
    account: {
      address: '12345L',
      balance: 120,
    },
    showDelegate: false,
  });

  const myOptions = {
    context: {
      store, history, i18n, router: { route: history, history },
    },
    childContextTypes: {
      store: PropTypes.object.isRequired,
      history: PropTypes.object.isRequired,
      i18n: PropTypes.object.isRequired,
      router: PropTypes.object.isRequired,
    },
  };

  const mountWithRouter = (node, options) => mount(node, options);

  beforeEach(() => {
    wrapper = mountWithRouter(<TopBar {...myProps} />, myOptions);
  });

  it('renders <TopBar /> component', () => {
    expect(wrapper.find('.wrapper').at(0)).to.have.length(1);
  });

  it('renders <TopBar /> component with user log in', () => {
    expect(wrapper.find('MenuItems').at(0)).to.have.length(1);
    expect(wrapper.find('UserAccount').at(0)).to.have.length(1);
    expect(wrapper.find('.signIn').at(0)).to.have.length(0);
  });

  it('renders <TopBar /> component with user log in', () => {
    expect(wrapper.find('MenuItems').at(0)).to.have.length(1);
    expect(wrapper.find('UserAccount').at(0)).to.have.length(1);
    expect(wrapper.find('.signIn').at(0)).to.have.length(0);
  });

  it('renders only 2 menu items', () => {
    expect(wrapper.find('a.item')).to.have.length(2);
  });

  it('renders 3 menu items including delegates', () => {
    myProps.showDelegate = true;
    wrapper = mountWithRouter(<TopBar {...myProps} />, myOptions);
    expect(wrapper.find('a.item')).to.have.length(3);
  });

  it('logout user when user do a click on logout function', () => {
    wrapper.find('.avatar').simulate('click');
    wrapper.update();
    wrapper.find('.logout').simulate('click');
    wrapper.update();
    expect(myProps.logOut).have.been.calledWith();
  });

  it('renders sign in component when user is logout', () => {
    myProps.account = {};
    wrapper = mountWithRouter(<TopBar {...myProps} />, myOptions);
    expect(wrapper.find('.signIn')).to.have.length(1);
  });
});
