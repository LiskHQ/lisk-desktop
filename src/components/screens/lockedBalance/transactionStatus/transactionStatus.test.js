import React from 'react';
import { mount } from 'enzyme';
import TransactionStatus from './transactionStatus';

describe('unlock transaction Status', () => {
  const props = {
    transactionInfo: null,
    error: null,
    t: key => key,
    transactionBroadcasted: jest.fn(),
    history: {},
  };

  const propsWithConfirmedTx = {
    ...props,
    transactionInfo: { id: 1 },
    transactions: {
      confirmed: [{ id: 1 }],
      txBroadcastError: null,
      txSignatureError: null,
      signedTransaction: {},
    },
  };
  const propsWithError = {
    ...props,
    transactions: {
      confirmed: [],
      txBroadcastError: { message: 'error:test' },
      txSignatureError: null,
      signedTransaction: {},
    },
    error: { message: 'error:test' },
  };

  it('renders properly Status component when transaction is successfully submitted', () => {
    const wrapper = mount(<TransactionStatus {...propsWithConfirmedTx} />);
    const html = wrapper.html();
    expect(html).not.toContain('failed');
    expect(html).not.toContain('something went wrong');
    expect(html).toContain('submitted');
    expect(html).toContain('confirmed');
  });

  it('renders properly Status component when transaction failed', () => {
    const wrapper = mount(<TransactionStatus {...propsWithError} />);
    const html = wrapper.html();
    expect(html).toContain('failed');
    expect(html).toContain('something went wrong');
    expect(html).not.toContain('submitted');
    expect(html).not.toContain('confirmed');
  });
});
