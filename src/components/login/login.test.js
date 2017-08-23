import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { BrowserRouter as Router } from 'react-router-dom';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import LoginFormHOC from './login';

describe('LoginForm HOC', () => {
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
  let wrapper;

  beforeEach(() => {
    wrapper = mount(<Provider store={store}>
      <Router><LoginFormHOC/></Router></Provider>);
  });

  it('should mount LoginForm', () => {
    expect(wrapper.find('LoginForm')).to.have.lengthOf(1);
  });

  it('should mount LoginForm with appropriate properties', () => {
    const props = wrapper.find('LoginForm').props();
    expect(props.peers).to.be.equal(peers);
    expect(props.account).to.be.equal(account);
    expect(typeof props.activePeerSet).to.be.equal('function');
  });
});
