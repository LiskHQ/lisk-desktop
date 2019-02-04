import React from 'react';
import { expect } from 'chai';
import { spy } from 'sinon';
import { mount } from 'enzyme';
import PropTypes from 'prop-types';
import configureMockStore from 'redux-mock-store';
import i18n from '../../i18n';
import TransactionsOverviewV2 from './transactionsOverviewV2';
import accounts from '../../../test/constants/accounts';

describe('TransactionsOverview V2', () => {
  let wrapper;

  const peers = {
    data: {},
    options: {},
    liskAPIClient: {},
  };

  const transactions = [{
    id: '11327666066806006572',
    type: 0,
    timestamp: 15647029,
    senderId: '5201600508578320196L',
    recipientId: accounts.genesis.address,
    amount: 69550000000,
    fee: 10000000,
    confirmations: 4314504,
    address: '12345678L',
    asset: {},
  }];

  const store = configureMockStore([])({
    peers,
    account: accounts.genesis,
    followedAccounts: {
      accounts: [],
    },
  });

  const props = {
    t: data => data,
    address: accounts.genesis.address,
    onInit: spy(),
    onLoadMore: spy(),
    onFilterSet: spy(),
    account: accounts.genesis,
    followedAccounts: [],
    transactions,
    peers,
    history: {
      push: spy(),
    },
  };

  const options = {
    context: {
      store, i18n,
    },
    childContextTypes: {
      store: PropTypes.object.isRequired,
      i18n: PropTypes.object.isRequired,
    },
  };

  beforeEach(() => {
    wrapper = mount(<TransactionsOverviewV2 {...props}/>, options);
  });

  it('should call onInit on constructor call', () => {
    expect(props.onInit).to.have.been.calledWith();
  });

  it('should call onFilterSet when filtering transations', () => {
    wrapper.find('.transaction-filter-item').first().simulate('click');
    expect(props.onFilterSet).to.have.been.calledWith();
  });

  it('should render with shortname when screen is small', () => {
    window.innerWidth = 200;
    wrapper = mount(<TransactionsOverviewV2 {...props}/>, options);
    expect(wrapper.find('.filter-in')).to.have.text('In');
    expect(wrapper.find('.filter-out')).to.have.text('Out');
  });
});
