import React from 'react';
import { shallow } from 'enzyme';
import TransactionStatus from './transactionStatus';
import signedTX from '../../../../../test/fixtures/signedTx.json';

describe('unlock transaction Status', () => {
  const props = {
    t: key => key,
    transactionBroadcasted: jest.fn(),
    transactions: {
      txBroadcastError: null,
      txSignatureError: null,
      signedTransaction: {},
    },
  };

  const propsWithSignedTx = {
    ...props,
    transactions: {
      txBroadcastError: null,
      txSignatureError: null,
      signedTransaction: signedTX,
    },
  };
  const propsWithError = {
    ...props,
    transactions: {
      txBroadcastError: { message: 'error:test' },
      txSignatureError: null,
      signedTransaction: {},
    },
  };

  it.skip('renders a pending state when the transactions not submitted yet. then submits it.', () => {
    const wrapper = shallow(<TransactionStatus {...propsWithSignedTx} />);
    expect(wrapper.find('PrimaryButton')).toExist();
  });

  it.skip('renders properly Status component when transaction failed', () => {
    const wrapper = shallow(<TransactionStatus {...propsWithError} />);
    const html = wrapper.html();
    expect(html).toContain('failed');
    expect(html).toContain('something went wrong');
    expect(html).not.toContain('submitted');
    expect(html).not.toContain('confirmed');
  });
});
