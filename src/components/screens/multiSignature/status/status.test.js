import React from 'react';
import { shallow } from 'enzyme';
import TransactionResult from '@shared/transactionResult';
import Status from './status';
import accounts from '../../../../../test/constants/accounts';

describe('Multisignature status component', () => {
  const props = {
    t: v => v,
    transactions: {
      confirmed: [],
      txBroadcastError: null,
      txSignatureError: null,
      signedTransaction: { signatures: ['123', '987'] },
    },
  };

  const signedTransaction = {
    id: '4:0',
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
    expect(wrapper.find('.transaction-status')).toExist();
    expect(wrapper.find(TransactionResult).props()).toEqual({
      illustration: 'registerMultisignature',
      status: { code: 'SIGNATURE_SUCCESS' },
      title: 'Submitting the transaction',
      message: 'Your transaction is being submitted to the blockchain.',
      className: 'content',
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
    expect(wrapper.find('.transaction-status')).toExist();
    expect(wrapper.find(TransactionResult).props()).toEqual({
      illustration: 'registerMultisignature',
      status: { code: 'SIGNATURE_ERROR', message: JSON.stringify({ message: 'error:test' }) },
      title: 'Transaction failed',
      message: 'An error occurred while signing your transaction. Please try again.',
      className: 'content',
    });
  });

  it('passes correct props to TransactionResult when transaction broadcast fails', () => {
    const propsWithError = {
      ...props,
      transactions: {
        txBroadcastError: { message: 'error:test' },
        txSignatureError: null,
        signedTransaction: { },
      },
    };

    const wrapper = shallow(<Status {...propsWithError} />);
    expect(wrapper.find('.transaction-status')).toExist();
    expect(wrapper.find(TransactionResult).props()).toEqual({
      illustration: 'registerMultisignature',
      status: { code: 'BROADCAST_ERROR', message: JSON.stringify({ message: 'error:test' }) },
      title: 'Transaction failed',
      message: 'An error occurred while sending your transaction to the network. Please try again.',
      className: 'content',
    });
  });

  it('passes correct props to TransactionResult when transaction broadcast success', () => {
    const propsSuccess = {
      ...props,
      transactions: {
        txBroadcastError: null,
        txSignatureError: null,
        signedTransaction: { },
      },
    };

    const wrapper = shallow(<Status {...propsSuccess} />);
    expect(wrapper.find('.transaction-status')).toExist();
    expect(wrapper.find(TransactionResult).props()).toMatchObject({
      illustration: 'registerMultisignature',
      status: { code: 'BROADCAST_SUCCESS' },
      title: 'Transaction submitted',
      className: 'content',
    });
  });
});
