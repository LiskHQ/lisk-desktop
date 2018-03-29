import React from 'react';
import { MemoryRouter as Router } from 'react-router-dom';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import i18n from '../../i18n';
import SendHOC from './index';

describe('SendWritableHOC', () => {
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
    wrapper = mount(<Router><Provider store={store}><SendHOC i18n={i18n} /></Provider></Router>);
  });

  it('should render Send', () => {
    expect(wrapper.find('SendWritable')).to.have.lengthOf(1);
  });
});
