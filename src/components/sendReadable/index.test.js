import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import i18n from '../../i18n';
import SendHOC from './index';

describe('SendReadableHOC', () => {
  let wrapper;
  const store = {};
  const account = {};
  const transactions = { pending: [] };
  beforeEach(() => {
    store.getState = () => ({
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
    expect(props.account).to.be.equal(account);
    expect(typeof props.sent).to.be.equal('function');
  });
});
