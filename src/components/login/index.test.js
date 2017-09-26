import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { BrowserRouter as Router } from 'react-router-dom';
import configureMockStore from 'redux-mock-store';
import PropTypes from 'prop-types';
import i18n from '../../i18n';
import LoginHOC from './index';

describe('LoginHOC', () => {
  // Mocking store
  const peers = {
    status: {
      online: false,
    },
    data: {
      currentPeer: 'localhost',
      port: 4000,
      options: {
        name: 'Custom Node',
      },
    },
  };
  const account = {
    isDelegate: false,
    address: '16313739661670634666L',
    username: 'lisk-nano',
  };
  const store = configureMockStore([])({
    peers,
    account,
    activePeerSet: () => {},
  });
  const options = {
    context: { store, history, i18n },
    childContextTypes: {
      store: PropTypes.object.isRequired,
      history: PropTypes.object.isRequired,
      i18n: PropTypes.object.isRequired,
    },
  };
  let wrapper;

  beforeEach(() => {
    wrapper = mount(<Router><LoginHOC store={store}/></Router>, options);
  });

  it('should mount Login', () => {
    expect(wrapper.find('Login')).to.have.lengthOf(1);
  });

  it('should mount Login with appropriate properties', () => {
    const props = wrapper.find('Login').props();
    expect(props.peers).to.be.equal(peers);
    expect(props.account).to.be.equal(account);
    expect(typeof props.activePeerSet).to.be.equal('function');
  });
});
