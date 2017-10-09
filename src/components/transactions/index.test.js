import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import PropTypes from 'prop-types';
import { BrowserRouter as Router } from 'react-router-dom';
import TransactionsHOC from './index';
import i18n from '../../i18n';
import store from '../../store';
import history from '../../history';


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
    wrapper = mount(<Provider store={store}><Router><TransactionsHOC /></Router></Provider>, {
      context: { store, history, i18n },
      childContextTypes: {
        store: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
        i18n: PropTypes.object.isRequired,
      },
    });
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

