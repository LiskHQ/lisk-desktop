import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import PropTypes from 'prop-types';
import { MemoryRouter as Router } from 'react-router-dom';
import TransactionsList from './transactionsList';
import actionTypes from '../../constants/actions';
import txFilters from '../../constants/transactionFilters';
import store from '../../store';


describe('TransactionsList ', () => {
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
    asset: {},
    token: 'LSK',
  }];

  const options = {
    context: { store },
    childContextTypes: { store: PropTypes.object.isRequired },
  };

  const props = {
    bookmarks: {
      LSK: [],
      BTC: [],
    },
    address: '',
    filter: {
      value: txFilters.incoming,
      name: 'In',
    },
    loading: [],
    transactions,
    onClick: () => {},
    loadMore: () => {},
    t: () => {},
    history: { location: { search: { id: transactions[0].id } } },
    activeToken: 'LSK',
  };

  it('should render list of transactions', () => {
    wrapper = mount(<Router><TransactionsList {...props} /></Router>, options);
    expect(wrapper).to.have.descendants('.transactions-row');
  });

  it('should render only the empty state if transaction list is empty', () => {
    const propsNoTx = {
      ...props,
      transactions: emptyTx,
      filter: {
        value: txFilters.all,
        name: 'All',
      },
    };
    wrapper = mount(<Router><TransactionsList {...propsNoTx} /></Router>, options);
    expect(wrapper).to.have.descendants('.empty-state');
  });

  it('should render loading spinner', () => {
    const loadingProps = {
      ...props,
      loading: [actionTypes.getTransactions],
    };
    wrapper = mount(<Router><TransactionsList {...loadingProps} /></Router>, options);
    expect(wrapper).to.have.descendants('Spinner');
  });
});
