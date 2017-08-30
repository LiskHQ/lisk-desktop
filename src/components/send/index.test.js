import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import SendHOC from './index';
import store from '../../store';


describe('SendHOC', () => {
  let wrapper;
  const peers = {
    data: {},
    status: true,
  };
  const account = {};

  beforeEach(() => {
    store.getState = () => ({
      peers,
      account,
    });
    wrapper = mount(<Provider store={store}><SendHOC /></Provider>);
  });

  it('should render Send', () => {
    expect(wrapper.find('Send')).to.have.lengthOf(1);
  });

  it('should mount Send with appropriate properties', () => {
    const props = wrapper.find('Send').props();
    expect(props.activePeer).to.be.equal(peers.data);
    expect(props.account).to.be.equal(account);
    expect(typeof props.sent).to.be.equal('function');
  });
});
