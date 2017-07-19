import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import LoginForm from './loginForm';
import LoginFormComponent from './loginFormComponent';
import Lisk from 'lisk-js';

describe('LoginForm', () => {
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

  const store = {
    dispatch: () => {},
    subscribe: () => {},
    getState: () => ({
      peers,
      account,
      onAccountUpdated: (data) => {
        store.account = data;
      },
      activePeerSet: (network) => {
        store.peers.data = Lisk.api(network);
      },
    }),
  };
  const options = {
    context: { store },
    // childContextTypes: { store: React.PropTypes.object.isRequired },
  };

  it.skip('should mount LoginFormComponent with appropriate properties', () => {
    const mountedAccount = mount(<LoginForm/>, options);
    const props = mountedAccount.find(LoginFormComponent).props();
    expect(props.peers).to.be.equal(peers);
    expect(props.account).to.be.equal(account);
    expect(typeof props.onAccountUpdated).to.be.equal('function');
    expect(typeof props.onAccountUpdated).to.be.equal('function');
  });
});
