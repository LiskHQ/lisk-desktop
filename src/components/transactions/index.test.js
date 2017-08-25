import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import TransactionsHOC from './index';
import store from '../../store';


describe('TransactionsHOC', () => {
  let wrapper;
  const confirmed = [];
  const pending = [];
  const transactions = {
    pending,
    confirmed,
    count: confirmed.length,
  };
  const account = { address: '16313739661670634666L' };
  const peers = { data: {} };

  beforeEach(() => {
    store.getState = () => ({
      peers,
      transactions,
      account,
    });
    wrapper = mount(<Provider store={store}><TransactionsHOC /></Provider>);
  });

  it('should render Transactions', () => {
    expect(wrapper.find('Transactions')).to.have.lengthOf(1);
  });

  it('should mount Transactions with appropriate properties', () => {
    const props = wrapper.find('Transactions').props();
    expect(props.address).to.be.equal(account.address);
    expect(props.activePeer).to.be.equal(peers.data);
    expect(props.transactions).to.deep.equal([...transactions, ...pending]);
    expect(props.count).to.be.equal(transactions.count);
    expect(props.confirmedCount).to.be.equal(confirmed.length);
    expect(props.pendingCount).to.be.equal(pending.length);
    expect(typeof props.transactionsRequested).to.be.equal('function');
  });
});

