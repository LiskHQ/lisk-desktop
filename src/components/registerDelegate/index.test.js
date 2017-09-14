import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import RegisterDelegateHOC from './index';

describe('RegisterDelegateHOC', () => {
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
    wrapper = mount(<Provider store={store}><RegisterDelegateHOC /></Provider>);
  });

  it('should render RegisterDelegate', () => {
    expect(wrapper.find('RegisterDelegate')).to.have.lengthOf(1);
  });

  it('should mount registerDelegate with appropriate properties', () => {
    const props = wrapper.find('RegisterDelegate').props();
    expect(props.peers).to.be.equal(peers);
    expect(props.account).to.be.equal(account);
    expect(typeof props.delegateRegistered).to.be.equal('function');
  });
});
