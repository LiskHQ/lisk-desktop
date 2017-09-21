import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { BrowserRouter as Router } from 'react-router-dom';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../i18n';
import LoginHOC from './index';
import Login from './login';

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
  let wrapper;

  beforeEach(() => {
    wrapper = mount(<Provider store={store}>
        <I18nextProvider i18n={ i18n }>
          <Router><LoginHOC/></Router>
        </I18nextProvider>
      </Provider>);
  });

  it('should mount Login', () => {
    expect(wrapper.find(Login)).to.have.lengthOf(1);
  });

  it('should mount Login with appropriate properties', () => {
    const props = wrapper.find(Login).props();
    expect(props.peers).to.be.equal(peers);
    expect(props.account).to.be.equal(account);
    expect(typeof props.activePeerSet).to.be.equal('function');
  });
});
