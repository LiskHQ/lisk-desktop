import React from 'react';
import { shallow } from 'enzyme';
import accounts from '@tests/constants/wallets';
import TxBroadcaster from '@transaction/components/TxBroadcaster';
import Status from './Status';

jest.mock('@libs/wcm/hooks/useSession', () => ({
  respond: jest.fn(),
}));

describe('Validator Registration Status', () => {
  const props = {
    account: accounts.genesis,
    transactions: {
      confirmed: [],
      txBroadcastError: null,
    },
    transactionBroadcasted: jest.fn(),
    t: (key) => key,
  };

  const signedTransaction = {
    id: 'pos:registerValidator',
    senderPublicKey: accounts.genesis.summary.publicKey,
    signatures: [accounts.genesis.summary.publicKey],
    nonce: '19n',
    fee: '207000n',
  };

  it('passes correct props to TransactionResult when signed transaction', () => {
    const propsWithSignedTx = {
      ...props,
      transactions: {
        txBroadcastError: null,
        txSignatureError: null,
        signedTransaction,
      },
    };

    const wrapper = shallow(<Status {...propsWithSignedTx} />);
    expect(wrapper.find('.status-container')).toExist();
    expect(wrapper.find(TxBroadcaster).props()).toEqual({
      className: 'content',
      illustration: 'registerValidator',
      message: 'Your transaction is signed successfully.',
      status: {
        code: 'SIGNATURE_SUCCESS',
      },
      title: 'Submitting the transaction',
    });
  });

  it('passes correct props to TransactionResult when transaction sign failed', () => {
    const propsWithError = {
      ...props,
      transactions: {
        txBroadcastError: null,
        txSignatureError: { message: 'error:test' },
        signedTransaction: { signatures: ['123'] },
      },
    };

    const wrapper = shallow(<Status {...propsWithError} />);
    expect(wrapper.find('.status-container')).toExist();
    expect(wrapper.find(TxBroadcaster).props()).toEqual({
      className: 'content',
      illustration: 'registerValidator',
      message: 'An error occurred while signing your transaction. Please try again.',
      status: {
        code: 'SIGNATURE_ERROR',
        message: '{"error":"error:test"}',
      },
      onRetry: expect.any(Function),
      title: 'Transaction failed',
    });
  });

  it('passes correct props to TransactionResult when transaction broadcast fails', () => {
    const propsWithError = {
      ...props,
      transactions: {
        ...props.transactions,
        txBroadcastError: {
          error: 'error:test',
          transaction: props.transactions.signedTransaction,
        },
        txSignatureError: null,
      },
    };

    const wrapper = shallow(<Status {...propsWithError} />);
    expect(wrapper.find('.status-container')).toExist();
    expect(wrapper.find(TxBroadcaster).props()).toEqual({
      className: 'content',
      illustration: 'registerValidator',
      message: 'An error occurred while sending your transaction to the network. Please try again.',
      status: {
        code: 'BROADCAST_ERROR',
        message: JSON.stringify({
          error: 'error:test',
          transaction: props.transactions.signedTransaction,
        }),
      },
      onRetry: expect.any(Function),
      title: 'Transaction failed',
    });
  });

  it('passes correct props to TransactionResult when transaction broadcast success', () => {
    const propsSuccess = {
      ...props,
      transactions: {
        txBroadcastError: null,
        txSignatureError: null,
        signedTransaction: {},
      },
    };

    const wrapper = shallow(<Status {...propsSuccess} />);
    expect(wrapper.find('.status-container')).toExist();
    expect(wrapper.find(TxBroadcaster).props()).toEqual({
      className: 'content',
      illustration: 'registerValidator',
      message: 'You will be notified when your transaction is confirmed.',
      status: {
        code: 'BROADCAST_SUCCESS',
      },
      title: 'Validator registration submitted',
    });
  });
});
