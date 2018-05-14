import React from 'react';
import thunk from 'redux-thunk';
import { spy } from 'sinon';
import { expect } from 'chai';
import * as transactions from '../../actions/transactions';
import { mountWithContext } from './../../../test/utils/mountHelpers';
import AccountTransactions from './index';
import accounts from '../../../test/constants/accounts';

describe('AccountTransaction Component', () => {
  let wrapper;
  let props;
  let loadTransactionsSpy;

  const storeState = {
    peers: { data: { options: {} } },
    account: { address: accounts.genesis.address,
      delegate: {},
      publicKey: accounts.genesis.publicKey },
    transactions: {
      account: { balance: 0 },
      pending: [],
      confirmed: [],
    },
    loading: [],
  };

  beforeEach(() => {
    loadTransactionsSpy = spy(transactions, 'loadTransactions');

    props = {
      match: { params: { address: accounts.genesis.address } },
      history: { push: spy(), location: { search: ' ' } },
      t: key => key,
    };

    wrapper = mountWithContext(<AccountTransactions {...props} />,
      { storeState, middlewares: [thunk] });
  });

  afterEach(() => {
    loadTransactionsSpy.restore();
  });

  it('updates transactions on address update', () => {
    wrapper.setProps({ match: { params: { address: accounts['empty account'].address } } });

    expect(loadTransactionsSpy).to.have.been.calledWith({
      address: accounts['empty account'].address,
      activePeer: storeState.peers.data,
      publicKey: storeState.account.publicKey });
  });
});
