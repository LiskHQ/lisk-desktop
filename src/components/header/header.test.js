import React from 'react';
import { expect } from 'chai';
import { MemoryRouter as Router } from 'react-router-dom';
import { mount } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import PropTypes from 'prop-types';
import sinon from 'sinon';
import Header from './header';
import i18n from '../../i18n';
import routes from '../../constants/routes';
import accounts from './../../../test/constants/accounts';

describe('Header', () => {
  let wrapper;
  const mountWithRouter = (node, options) => mount(<Router>{node}</Router>, options);
  const storeObject = {
    peers: { data: {}, options: {} },
    account: {},
    activePeerSet: () => {},
    search: {
      suggestions: {
        delegates: [],
        addresses: [],
        transactions: [],
      },
    },
  };
  const mockInputProps = {
    setActiveDialog: () => { },
    resetTimer: sinon.spy(),
    logOut: sinon.spy(),
    history: { replace: sinon.spy() },
    account: { address: accounts.genesis.address },
    t: key => key,
    location: { pathname: `${routes.explorer.path}${routes.search}` },
    isAuthenticated: false,
    removePassphrase: sinon.spy(),
  };

  const history = {
    location: { pathname: `${routes.explorer.path}${routes.search}` },
    replace: sinon.spy(),
    createHref: sinon.spy(),
    push: sinon.spy(),
  };

  const store = configureMockStore([])(storeObject);
  const options = {
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

  it('renders 1 Link component if not logged in', () => {
    wrapper = mountWithRouter(<Header {...mockInputProps} />, options);
    expect(wrapper.find('Link')).to.have.length(1);
  });

  it('does not show timer if account is not locked auto logout it turned off', () => {
    mockInputProps.account.passphrase = accounts.genesis.passphrase;
    storeObject.account = { publicKey: '123' };
    wrapper = mountWithRouter(<Header {...mockInputProps} />, options);
    expect(wrapper.find('Countdown')).to.have.length(0);
  });

  it('does show timer if account is not locked auto logout it turned on', () => {
    mockInputProps.account.passphrase = accounts.genesis.passphrase;
    mockInputProps.account.expireTime = 1527755244818;
    mockInputProps.autoLog = true;
    storeObject.account = { publicKey: '123' };
    wrapper = mountWithRouter(<Header {...mockInputProps} />, options);
    expect(wrapper.find('Countdown')).to.have.length(1);
  });

  it('should display logout dialog window', () => {
    wrapper = mountWithRouter(<Header {...mockInputProps} />, options);
    wrapper.find('.logout').simulate('click');
    expect(wrapper.find('Countdown')).to.have.length(1);
  });

  it('should redirect to dashboard after 10 min', () => {
    wrapper = mountWithRouter(<Header {...mockInputProps} />, options);
    wrapper.find('Countdown').props().onComplete();
    expect(mockInputProps.history.replace).to.have.been.calledWith(`${routes.login.path}`);
  });
});
