import React from 'react';
import { expect } from 'chai';

import { mountWithContext } from '../../../test/utils/mountHelpers';
import Dashboard from './index';
import TransactionRow from '../transactions/transactionRow';

describe('Dashboard', () => {
  let wrapper;

  beforeEach(() => {
    const context = {
      storeState: {
        transactions: {
          pending: [],
          confirmed: [
            {
              id: '1038520263604146911',
            }, {
              id: '2038520263604146911',
            }, {
              id: '3038520263604146911',
            }, {
              id: '4038520263604146911',
            },
          ],
        },
        peers: {
          data: {},
          options: {},
        },
        loading: [],
        account: { address: 'some address', serverPublicKey: 'public_key' },
      },
    };
    wrapper = mountWithContext(<Dashboard history={ { location: {} } }/>, context);
  });

  it('should render transaction list with at most 3 transactions', () => {
    expect(wrapper.find(TransactionRow)).to.have.lengthOf(3);
  });
});
