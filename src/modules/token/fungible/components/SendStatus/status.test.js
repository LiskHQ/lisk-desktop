import React from 'react';
import { shallow } from 'enzyme';
import TxBroadcaster from '@transaction/components/TxBroadcaster';
import DialogLink from 'src/theme/dialog/link';
import accounts from '@tests/constants/wallets';
import Status from './Status';

describe('unlock transaction Status', () => {
  const props = {
    t: (key) => key,
    account: accounts.genesis,
    recipientAccount: { data: accounts.delegate },
    rawTx: {
      asset: {
        recipient: { address: accounts.delegate.summary.address },
      },
    },
    transactions: {
      txBroadcastError: null,
      txSignatureError: null,
      signedTransaction: { signatures: ['123'] },
    },
    bookmarks: {
      LSK: [],
    },
    token: 'LSK',
  };

  const signedTransaction = {
    id: '2:0',
    sender: { publicKey: accounts.genesis.summary.publicKey },
    signatures: [accounts.genesis.summary.publicKey],
    nonce: '19n',
    fee: '207000n',
  };

  it('passes correct props to TxBroadcaster when signed transaction and display add bookmark link', () => {
    const propsWithSignedTx = {
      ...props,
      transactions: {
        txBroadcastError: null,
        txSignatureError: null,
        signedTransaction,
      },
    };

    const wrapper = shallow(<Status {...propsWithSignedTx} />);
    expect(wrapper.find(TxBroadcaster).props()).toMatchObject({
      illustration: 'default',
      status: { code: 'SIGNATURE_SUCCESS' },
      title: 'Submitting the transaction',
      message: 'Your transaction is being submitted to the blockchain.',
    });
    expect(wrapper.find(DialogLink).props()).toMatchObject({
      component: 'addBookmark',
      data: {
        formAddress: 'lskehj8am9afxdz8arztqajy52acnoubkzvmo9cjy',
        isDelegate: true,
        label: 'genesis_17',
      },
    });
  });

  it('passes correct props to TxBroadcaster when transaction sign failed', () => {
    const propsWithError = {
      ...props,
      transactions: {
        txBroadcastError: null,
        txSignatureError: { message: 'error:test' },
        signedTransaction: { signatures: ['123'] },
      },
    };

    const wrapper = shallow(<Status {...propsWithError} />);
    expect(wrapper.find(TxBroadcaster).props()).toMatchObject({
      illustration: 'default',
      status: {
        code: 'SIGNATURE_ERROR',
        message: JSON.stringify({ message: 'error:test' }),
      },
      title: 'Transaction failed',
      message:
        'An error occurred while signing your transaction. Please try again.',
    });
  });

  it('passes correct props to TxBroadcaster when transaction broadcast fails', () => {
    const propsWithError = {
      ...props,
      recipientAccount: { data: accounts.delegate_candidate },
      rawTx: {
        asset: {
          recipient: { address: accounts.delegate_candidate.summary.address },
        },
      },
      transactions: {
        txBroadcastError: { message: 'error:test' },
        txSignatureError: null,
        signedTransaction: {},
      },
    };

    const wrapper = shallow(<Status {...propsWithError} />);
    expect(wrapper.find(TxBroadcaster).props()).toMatchObject({
      illustration: 'default',
      status: {
        code: 'BROADCAST_ERROR',
        message: JSON.stringify({ message: 'error:test' }),
      },
      title: 'Transaction failed',
      message:
        'An error occurred while sending your transaction to the network. Please try again.',
    });
  });

  it('passes correct props to TxBroadcaster when transaction broadcast success and display add bookmark link', () => {
    const propsSuccess = {
      ...props,
      transactions: {
        txBroadcastError: null,
        txSignatureError: null,
        signedTransaction: {},
      },
    };

    const wrapper = shallow(<Status {...propsSuccess} />);
    expect(wrapper.find(TxBroadcaster).props()).toMatchObject({
      illustration: 'default',
      status: { code: 'BROADCAST_SUCCESS' },
      message: 'Your transaction has been submitted and will be confirmed in a few moments.',
      title: 'Transaction submitted',
    });
    expect(wrapper.find(DialogLink).props()).toMatchObject({
      component: 'addBookmark',
      data: {
        formAddress: 'lskehj8am9afxdz8arztqajy52acnoubkzvmo9cjy',
        isDelegate: true,
        label: 'genesis_17',
      },
    });
  });

  it('should not show bookmark button if sent to self', () => {
    const propsToSelf = {
      ...props,
      account: accounts.delegate,
    };

    const wrapper = shallow(<Status {...propsToSelf} />);
    expect(wrapper.find('.bookmark-container')).not.toExist();
  });

  it('should not show bookmark button if already a bookmark', () => {
    const propsWithBookmarks = {
      ...props,
      bookmarks: {
        LSK: [{ address: accounts.delegate.summary.address }],
      },
    };

    const wrapper = shallow(<Status {...propsWithBookmarks} />);
    expect(wrapper.find('.bookmark-container')).not.toExist();
  });
});
