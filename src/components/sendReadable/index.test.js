import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import i18n from '../../i18n';
import SendHOC from './index';

describe('SendReadableHOC', () => {
  let wrapper;
  const store = {};
  const peers = {
    data: {},
    status: true,
  };
  const account = {};
  const transactions = { pending: [] };
  beforeEach(() => {
    store.getState = () => ({
      peers,
      account,
      transactions,
    });
    store.subscribe = () => {};
    store.dispatch = () => {};
    wrapper = mount(<Provider store={store}><SendHOC i18n={i18n} /></Provider>);
  });

  it('should render Send', () => {
    expect(wrapper.find('SendReadable')).to.have.lengthOf(1);
  });

  it('should mount Send with appropriate properties', () => {
    const props = wrapper.find('SendReadable').props();
    expect(props.activePeer).to.be.equal(peers.data);
    expect(props.account).to.be.equal(account);
    expect(typeof props.sent).to.be.equal('function');
  });
});
