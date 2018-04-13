import React from 'react';
import { expect } from 'chai';
import { spy } from 'sinon';
import { mount } from 'enzyme';
import PropTypes from 'prop-types';
import configureMockStore from 'redux-mock-store';
import TransactionsList from './transactionList';
import txFilters from '../../constants/transactionFilters';
import i18n from '../../i18n';

describe('TransactionsList', () => {
  let wrapper;
  const emptyTx = [];
  const transactions = [{
    id: '11327666066806006572',
    type: 0,
    timestamp: 15647029,
    senderId: '5201600508578320196L',
    recipientId: '11950819909555235066L',
    amount: 69550000000,
    fee: 10000000,
    confirmations: 4314504,
    address: '12345678L',
  }];
  const props = {
    address: '',
    filter: {
      value: txFilters.incoming,
      name: 'In',
    },
    transactions,
    loading: false,
    dashboard: false,
    onClick: () => {},
    loadMore: () => {},
    prevStep: () => {},
    transactionsRequestInit: () => {},
    t: () => {},
    history: { location: { search: { id: transactions[0].id } } },
  };

  const store = configureMockStore([])({});

  const options = {
    context: { store, i18n },
    childContextTypes: {
      store: PropTypes.object.isRequired,
      i18n: PropTypes.object.isRequired,
    },
  };

  it('should render nothing while loading', () => {
    const propsOnLoading = Object.assign({}, props, { loading: true });
    wrapper = mount(<TransactionsList {...propsOnLoading} />, options);
    expect(wrapper.html()).to.be.equal(null);
  });

  it('should render empty state template if transactions list is empty', () => {
    const propsNoTx = Object.assign({}, props, { transactions: emptyTx });
    wrapper = mount(<TransactionsList {...propsNoTx} />, options);
    expect(wrapper.find('.empty-message')).to.have.lengthOf(1);
  });

  it('should render nothing if transactions list is empty and filter is ALL', () => {
    const propsNoTx = Object.assign({}, props, {
      transactions: emptyTx,
      filter: {
        value: txFilters.all,
        name: 'All',
      },
    });
    wrapper = mount(<TransactionsList {...propsNoTx} />, options);
    expect(wrapper.html()).to.be.equal(null);
  });

  it('should render tx details if nextStep is a function', () => {
    const propsTxDetails = Object.assign({}, props, { nextStep: spy() });
    wrapper = mount(<TransactionsList {...propsTxDetails} />, options);

    wrapper.setProps({
      history: {
        location: {
          search: { id: transactions[0].id },
        },
      },
    });
    wrapper.update();
    expect(propsTxDetails.nextStep).to.have.been.calledWith({
      value: transactions[0],
      t: propsTxDetails.t,
    });
  });
});
