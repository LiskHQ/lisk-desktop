import React from 'react';
import { shallow } from 'enzyme';
import TransactionResult from '@transaction/detail/manager/transactionResult';
import accounts from '@tests/constants/wallets';
import Status from './status';

describe('Status', () => {
  const props = {
    t: v => v,
    account: accounts.non_migrated,
    balance: 1e20,
    transactions: {
      confirmed: [],
      signedTransaction: {},
      txSignatureError: null,
      txBroadcastError: null,
    },
    isMigrated: false,
  };

  const signedTransaction = {
    id: '1000:0',
    senderPublicKey: accounts.non_migrated.summary.publicKey,
    signatures: [accounts.non_migrated.summary.publicKey],
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
    expect(wrapper.find(TransactionResult).props()).toMatchObject({
      illustration: 'default',
      status: { code: 'SIGNATURE_SUCCESS' },
      title: 'Submitting the transaction',
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
    expect(wrapper.find('.status-container')).toExist();
    expect(wrapper.find(TransactionResult).props()).toMatchObject({
      illustration: 'default',
      status: { code: 'SIGNATURE_ERROR', message: JSON.stringify({ message: 'error:test' }) },
      title: 'Transaction failed',
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
    expect(wrapper.find('.status-container')).toExist();
    expect(wrapper.find(TransactionResult).props()).toMatchObject({
      illustration: 'default',
      status: { code: 'BROADCAST_ERROR', message: JSON.stringify({ message: 'error:test' }) },
      title: 'Transaction failed',
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
    expect(wrapper.find('.status-container')).toExist();
    expect(wrapper.find(TransactionResult).props()).toMatchObject({
      illustration: 'default',
      status: { code: 'BROADCAST_SUCCESS' },
      title: 'Balance reclaimed successfully',
      className: 'content',
    });
  });
});
