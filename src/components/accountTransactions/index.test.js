import React from 'react';
import { spy } from 'sinon';
import { expect } from 'chai';
import * as transactions from '../../actions/transactions';
import { mountWithContext } from './../../../test/utils/mountHelpers';
import AccountTransactions from './index';

describe('AccountTransaction Component', () => {
  let wrapper;
  let props;
  let transactionsRequestInitSpy;

  beforeEach(() => {
    transactionsRequestInitSpy = spy(transactions, 'transactionsRequestInit');
    const storeState = {
      transactions: {
        account: { balance: 0 },
        pending: [],
        confirmed: [],
      },
      peers: { options: { data: {} } },
      account: { address: 'some address' },
      loading: [],
    };

    props = {
      match: { params: { address: '987654321L' } },
      history: { push: spy(), location: { search: ' ' } },
      t: key => key,
    };
    wrapper = mountWithContext(<AccountTransactions {...props}/>, { storeState });
  });

  afterEach(() => {
    transactionsRequestInitSpy.restore();
  });

  it('updates transactions on address update', () => {
    expect(transactionsRequestInitSpy).to.have.been.calledWith({ address: '987654321L' });
    wrapper.setProps({ match: { params: { address: '12345L' } } });
    expect(transactionsRequestInitSpy).to.have.been.calledWith({ address: '12345L' });
  });
});
