import React from 'react';
import thunk from 'redux-thunk';
import { expect } from 'chai';
import { spy } from 'sinon';
import { mount } from 'enzyme';
import PropTypes from 'prop-types';
import TransactionsList from './transactionsList';

import { prepareStore } from '../../../test/utils/applicationInit';
import peersReducer from '../../store/reducers/peers';
import accountReducer from '../../store/reducers/account';
import transactionReducer from '../../store/reducers/transaction';
import delegateReducer from '../../store/reducers/delegate';
import accountMiddleware from '../../store/middlewares/account';
import peerMiddleware from '../../store/middlewares/peers';
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

  const store = prepareStore({
    peers: peersReducer,
    account: accountReducer,
    transaction: transactionReducer,
    delegate: delegateReducer,
  }, [
    thunk,
    peerMiddleware,
    accountMiddleware,
  ]);

  const options = {
    context: { store, i18n },
    childContextTypes: {
      store: PropTypes.object.isRequired,
      i18n: PropTypes.object.isRequired,
    },
  };

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
    t: () => {},
    history: { location: { search: { id: transactions[0].id } } },
  };

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

  it('should render delegate statistics', () => {
    const propsDelegateStatistics = Object.assign({}, props, {
      filter: {
        value: txFilters.statistics,
        name: 'delegate-statistics',
      },
    });
    wrapper = mount(<TransactionsList {...propsDelegateStatistics} />, options);
    expect(wrapper.find('.user-votes')).to.have.lengthOf(1);
    expect(wrapper.find('.voters')).to.have.lengthOf(1);
  });
});
