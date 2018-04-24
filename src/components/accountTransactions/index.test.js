import React from 'react';
import { spy } from 'sinon';
import { expect } from 'chai';
import * as transactions from '../../actions/transactions';
import { mountWithContext } from './../../../test/utils/mountHelpers';
import AccountTransactions from './index';

describe('AccountTransaction Component', () => {
  let wrapper;
  let props;
  let getTransactionsForAccountSpy;

  beforeEach(() => {
    getTransactionsForAccountSpy = spy(transactions, 'getTransactionsForAccount');
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
    getTransactionsForAccountSpy.restore();
  });

  it('updates transactions on address update', () => {
    expect(getTransactionsForAccountSpy).to.have.been.calledWith({ address: '987654321L' });
    wrapper.setProps({ match: { params: { address: '12345L' } } });
    expect(getTransactionsForAccountSpy).to.have.been.calledWith({ address: '12345L' });
  });
});
