import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import i18n from '../../i18n';
import AuthenticateHOC from './index';

describe('AuthenticateHOC', () => {
  let wrapper;
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
  });

  beforeEach(() => {
    wrapper = mount(<Provider store={store}><AuthenticateHOC i18n={i18n} /></Provider>);
  });

  it('should render Authenticate', () => {
    expect(wrapper.find('Authenticate')).to.have.lengthOf(1);
  });

  it('should mount Authenticate with appropriate properties', () => {
    const props = wrapper.find('Authenticate').props();
    expect(props.peers).to.be.equal(peers);
    expect(props.account).to.be.equal(account);
    expect(typeof props.accountUpdated).to.be.equal('function');
  });
});
