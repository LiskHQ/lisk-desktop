import React from 'react';
import PropTypes from 'prop-types';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { BrowserRouter as Router } from 'react-router-dom';
import LoginForm from './loginForm';
import LoginFormComponent from './loginFormComponent';

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
    }),
    activePeerSet: () => {},
  };
  const options = {
    context: { store },
    childContextTypes: { store: PropTypes.object.isRequired },
  };

  it('should mount LoginFormComponent with appropriate properties', () => {
    const mountedAccount = mount(<Router><LoginForm/></Router>, options);
    const props = mountedAccount.find(LoginFormComponent).props();
    console.log( Object.keys(props) )
    expect(props.peers).to.be.equal(peers);
    expect(props.account).to.be.equal(account);
    expect(typeof props.activePeerSet).to.be.equal('function');
  });
});
