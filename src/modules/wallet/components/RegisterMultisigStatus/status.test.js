import React from 'react';
import { shallow } from 'enzyme';
import TxBroadcaster from '@transaction/components/TxBroadcaster';
import accounts from '@tests/constants/wallets';
import Status from './status';

jest.mock('@libs/wcm/hooks/useSession', () => ({
  respond: jest.fn(),
}));
describe('Multisignature Status component', () => {
  const props = {
    t: (v) => v,
    transactions: {
      confirmed: [],
      txBroadcastError: null,
      txSignatureError: null,
      signedTransaction: { signatures: ['123', '987'] },
    },
    authQuery: {
      isFetching: false,
      isFetched: true,
      data: {
        data: {
          numberOfSignatures: 1,
          mandatoryKeys: [],
          optionalKeys: [],
        },
      },
    },
    account: accounts.genesis,
  };

  const signedTransaction = {
    id: 'auth:registerMultisignature',
    senderPublicKey: accounts.genesis.summary.publicKey,
    signatures: [accounts.genesis.summary.publicKey],
    nonce: '19n',
    fee: '207000n',
  };

  it('passes correct props to TxBroadcaster when partial signed transaction', () => {
    const propsWithSignedTx = {
      ...props,
      account: accounts.multiSig,
      transactions: {
        txBroadcastError: null,
        txSignatureError: null,
        signedTransaction: {
          ...signedTransaction,
          senderPublicKey: accounts.multiSig.summary.publicKey,
          signatures: [accounts.multiSig.summary.publicKey],
          params: {
            optionalKeys: accounts.multiSig.keys.optionalKeys,
            mandatoryKeys: accounts.multiSig.keys.mandatoryKeys,
            numberOfSignatures: accounts.multiSig.keys.numberOfSignatures,
          },
        },
      },
    };

    const wrapper = shallow(<Status {...propsWithSignedTx} />);
    expect(wrapper.find('.transaction-status')).toExist();
    expect(wrapper.find(TxBroadcaster).props()).toEqual({
      illustration: 'registerMultisignature',
      status: { code: 'MULTISIG_SIGNATURE_PARTIAL_SUCCESS' },
      title: 'Your signature was successful',
      message: 'You can download or copy the transaction and share it with other members.',
      className: 'content',
    });
  });

  it('passes correct props to TxBroadcaster when signed transaction', () => {
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
    expect(wrapper.find(TxBroadcaster).props()).toEqual({
      illustration: 'registerMultisignature',
      status: { code: 'SIGNATURE_SUCCESS' },
      title: 'Submitting the transaction',
      message: 'Your transaction is signed successfully.',
      className: 'content',
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
    expect(wrapper.find('.transaction-status')).toExist();
    expect(wrapper.find(TxBroadcaster).props()).toEqual({
      illustration: 'registerMultisignature',
      status: { code: 'SIGNATURE_ERROR', message: JSON.stringify({ error: 'error:test' }) },
      title: 'Transaction failed',
      message: 'An error occurred while signing your transaction. Please try again.',
      className: 'content',
    });
  });

  it('passes correct props to TxBroadcaster when transaction broadcast fails', () => {
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
    expect(wrapper.find('.transaction-status')).toExist();
    expect(wrapper.find(TxBroadcaster).props()).toEqual({
      illustration: 'registerMultisignature',
      status: {
        code: 'BROADCAST_ERROR',
        message: JSON.stringify({
          transaction: props.transactions.signedTransaction,
          error: 'error:test',
        }),
      },
      title: 'Transaction failed',
      message: 'An error occurred while sending your transaction to the network. Please try again.',
      className: 'content',
    });
  });

  it('passes correct props to TxBroadcaster when transaction broadcast success', () => {
    const propsSuccess = {
      ...props,
      transactions: {
        txBroadcastError: null,
        txSignatureError: null,
        signedTransaction: {},
      },
    };

    const wrapper = shallow(<Status {...propsSuccess} />);
    expect(wrapper.find('.transaction-status')).toExist();
    expect(wrapper.find(TxBroadcaster).props()).toMatchObject({
      illustration: 'registerMultisignature',
      status: { code: 'BROADCAST_SUCCESS' },
      title: 'Transaction submitted',
      className: 'content',
    });
  });

  it('Should be in edit mode', () => {
    const customProp = {
      ...props,
      authQuery: { data: { data: { numberOfSignatures: 3 } } },
      transactions: {
        txBroadcastError: null,
        txSignatureError: null,
        signedTransaction: {},
      },
    };

    const wrapper = shallow(<Status {...customProp} />);
    expect(wrapper.find('div.header')).toHaveText('Edit multisignature account');
  });
});
