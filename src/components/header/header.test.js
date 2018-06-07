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
    peers: { data: { options: {} } },
    account: {},
    activePeerSet: () => {},
  };
  const mockInputProps = {
    setActiveDialog: () => { },
    resetTimer: sinon.spy(),
    account: { address: accounts.genesis.address },
    t: key => key,
    location: { pathname: `${routes.explorer.path}${routes.search}` },
    isAuthenticated: false,
  };

  const store = configureMockStore([])(storeObject);
  const options = {
    context: { store, i18n },
    childContextTypes: {
      store: PropTypes.object.isRequired,
      i18n: PropTypes.object.isRequired,
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
    expect(wrapper.find('.unlocked')).to.have.length(1);
  });

  it('does show timer if account is not locked auto logout it turned on', () => {
    mockInputProps.account.passphrase = accounts.genesis.passphrase;
    mockInputProps.account.expireTime = 1527755244818;
    mockInputProps.autoLog = true;
    storeObject.account = { publicKey: '123' };
    wrapper = mountWithRouter(<Header {...mockInputProps} />, options);
    expect(wrapper.find('Countdown')).to.have.length(1);
  });
});
