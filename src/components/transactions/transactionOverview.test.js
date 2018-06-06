import React from 'react';
import { expect } from 'chai';
import { spy } from 'sinon';
import { mountWithContext } from './../../../test/utils/mountHelpers';
import TransactionOverview from './transactionOverview';
import store from '../../store';
import accounts from './../../../test/constants/accounts';

describe('TransactionOverview', () => {
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
        data: {},
      },
      transactions: [{ id: '13395546734664987127' }],
      count: 1000,
      address: accounts.genesis.address,
      onInit: () => {},
      onLoadMore: () => {},
      onFilterSet: () => {},
    };
    store.getState = () => ({
      peers: { status: {}, options: {}, data: {} },
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
<TransactionOverview {...props} store={store} />,
{ storeState: store },
    );
  });

  it('should render Waypoint on smallScreen', () => {
    expect(wrapper).to.have.descendants('Waypoint');
  });

  it('should show empty state when no transactions', () => {
    wrapper.setProps({ transactions: [] });
    wrapper.update();
    expect(wrapper.find('EmptyState')).to.be.present();
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
