import React from 'react';
import { expect } from 'chai';
import { spy } from 'sinon';
import { mountWithContext } from '../../../test/utils/mountHelpers';
import TransactionsOverviewV2 from './transactionsOverviewV2';
import store from '../../store';
import accounts from '../../../test/constants/accounts';

describe('TransactionsOverview', () => {
  let wrapper;
  let props;
  let onInitSpy;
  let onLoadMoreSpy;
  let onFilterSetSpy;

  beforeEach(() => {
    window.innerWidth = 200;
    props = {
      t: () => {},
      loading: [],
      peers: {
        liskAPIClient: {},
      },
      transactions: [{ id: '13395546734664987127' }],
      count: 1000,
      address: accounts.genesis.address,
      onInit: () => {},
      onLoadMore: () => {},
      onFilterSet: () => {},
      match: { url: '/wallet' },
    };
    store.getState = () => ({
      followedAccounts: { accounts: [] },
      peers: { status: {}, options: {}, liskAPIClient: {} },
      transactions: {
        confirmed: [],
      },
      account: {
        address: accounts.genesis.address,
      },
      search: {},
    });
    onInitSpy = spy(props, 'onInit');
    onLoadMoreSpy = spy(props, 'onLoadMore');
    onFilterSetSpy = spy(props, 'onFilterSet');
    wrapper = mountWithContext(
      <TransactionsOverviewV2 {...props} store={store} />,
      { storeState: store },
    );
  });

  it('should render Waypoint on smallScreen', () => {
    expect(wrapper).to.have.descendants('Waypoint');
  });

  /* eslint-disable no-unused-expressions */
  it('should call onInit on constructor call', () => {
    expect(onInitSpy).to.have.been.calledOnce;
  });

  it('should call onLoadMore when Waypoint reached', () => {
    wrapper.find('Waypoint').props().onEnter();
    expect(onLoadMoreSpy).to.have.been.calledOnce;
  });

  it('should call onFilterSet when filtering transations', () => {
    wrapper.find('.transaction-filter-item').first().simulate('click');
    expect(onFilterSetSpy).to.have.been.calledOnce;
  });
  /* eslint-enable no-unused-expressions */
});
