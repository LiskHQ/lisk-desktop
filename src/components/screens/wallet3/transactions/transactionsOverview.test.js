import React from 'react';
import { expect } from 'chai';
import { spy } from 'sinon';
import { mount } from 'enzyme';
import TransactionsOverview from './transactionsOverview';
import accounts from '../../../../../test/constants/accounts';

describe('TransactionsOverview ', () => {
  let wrapper;

  const transactions = [{
    id: '11327666066806006572',
    type: 0,
    timestamp: 15647029,
    senderId: '5201600508578320196L',
    recipientId: accounts.genesis.address,
    amount: '69550000000',
    fee: 10000000,
    confirmations: 4314504,
    address: '12345678L',
    asset: {},
  }];

  const props = {
    t: data => data,
    address: accounts.genesis.address,
    onInit: spy(),
    onLoadMore: spy(),
    onFilterSet: spy(),
    account: accounts.genesis,
    bookmarks: {
      LSK: [],
      BTC: [],
    },
    transactions,
    loading: [],
    history: {
      push: spy(),
    },
    activeCustomFilters: {
      dateFrom: '',
      dateTo: '',
      amountFrom: '',
      amountTo: '',
      message: '',
    },
    activeToken: 'LSK',
  };

  beforeEach(() => {
    wrapper = mount(<TransactionsOverview {...props} />);
  });

  it('should call onInit on constructor call', () => {
    expect(props.onInit).to.have.been.calledWith();
  });

  it('should call onFilterSet when filtering transations', () => {
    wrapper.find('.filter-all').first().simulate('click');
    expect(props.onFilterSet).to.have.been.calledWith();
  });

  it('should not show in/out filters if active token is BTC', () => {
    expect(wrapper).to.have.exactly(1).descendants('.filter-all');
    expect(wrapper).to.have.exactly(1).descendants('.filter-in');
    expect(wrapper).to.have.exactly(1).descendants('.filter-out');

    wrapper.setProps({ activeToken: 'BTC' });

    expect(wrapper).to.have.exactly(1).descendants('.filter-all');
    expect(wrapper).to.have.exactly(0).descendants('.filter-in');
    expect(wrapper).to.have.exactly(0).descendants('.filter-out');
  });
});
