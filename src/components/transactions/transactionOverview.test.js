import React from 'react';
import { expect } from 'chai';
import { mountWithContext } from './../../../test/utils/mountHelpers';
import TransactionOverview from './transactionOverview';
import store from '../../store';
import accounts from './../../../test/constants/accounts';

describe('TransactionOverview', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    window.innerWidth = 200;
    props = {
      t: () => {},
      loading: [],
      peers: {
        data: {},
      },
      address: accounts.genesis.address,
      loadTransactions: () => {},
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
    wrapper = mountWithContext(<TransactionOverview {...props} store={store} />,
      { storeState: store });
  });

  it('should render Waypoint on smallScreen', () => {
    expect(wrapper).to.have.descendants('Waypoint');
  });
});
