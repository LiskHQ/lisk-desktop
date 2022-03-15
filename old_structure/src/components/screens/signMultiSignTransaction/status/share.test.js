import React from 'react';
import { shallow } from 'enzyme';
import TransactionResult from '@shared/transactionResult';
import Status from './status';
import accounts from '../../../../../test/constants/accounts';

describe('Sign Multisignature Tx Status component', () => {
  const props = {
    t: (str, dict) => (dict ? str.replace('{{errorMessage}}', dict.errorMessage) : str),
    sender: { data: accounts.multiSig },
    transactions: {
      txBroadcastError: null,
      txSignatureError: null,
      signedTransaction: {},
    },
  };

  const signedTransaction = {
    id: '4:0',
    senderPublicKey: accounts.multiSig.summary.publicKey,
    signatures: [accounts.multiSig.summary.publicKey],
    nonce: '19n',
    fee: '207000n',
    moduleID: '4',
    assetID: '0',
    asset: {
      optionalKeys: accounts.multiSig.keys.optionalKeys,
      mandatoryKeys: accounts.multiSig.keys.mandatoryKeys,
      numberOfSignatures: accounts.multiSig.keys.numberOfSignatures,
    },
  };

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
    expect(wrapper.find(TransactionResult).props()).toEqual({
      illustration: 'signMultisignature',
      status: { code: 'SIGNATURE_ERROR', message: JSON.stringify({ message: 'error:test' }) },
      title: 'Transaction failed',
      message: 'An error occurred while signing your transaction. Please try again.',
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
    expect(wrapper.find(TransactionResult).props()).toMatchObject({
      illustration: 'signMultisignature',
      status: { code: 'BROADCAST_SUCCESS' },
      title: 'Transaction submitted',
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
    expect(wrapper.find(TransactionResult).props()).toEqual({
      illustration: 'signMultisignature',
      status: { code: 'BROADCAST_ERROR', message: JSON.stringify({ message: 'error:test' }) },
      title: 'Transaction failed',
      message: 'An error occurred while sending your transaction to the network. Please try again.',
      className: 'content',
    });
  });

  it('passes correct props to TransactionResult when partial signed transaction', () => {
    const propsWithSignedTx = {
      ...props,
      account: accounts.multiSig,
      transactions: {
        txBroadcastError: null,
        txSignatureError: null,
        signedTransaction,
      },
    };

    const wrapper = shallow(<Status {...propsWithSignedTx} />);
    expect(wrapper.find(TransactionResult).props()).toEqual({
      illustration: 'signMultisignature',
      status: { code: 'MULTISIG_SIGNATURE_PARTIAL_SUCCESS' },
      title: 'Your signature was successful',
      message: 'You can download or copy the transaction and share it with other members.',
      className: 'content',
    });
  });

  it('passes correct props to TransactionResult when fully signed transaction', () => {
    const propsWithSignedTx = {
      ...props,
      account: accounts.multiSig,
      transactions: {
        txBroadcastError: null,
        txSignatureError: null,
        signedTransaction: {
          ...signedTransaction,
          signatures: [
            accounts.multiSig.summary.publicKey,
            ...accounts.multiSig.keys.optionalKeys,
            ...accounts.multiSig.keys.mandatoryKeys,
          ],
        },
      },
    };

    const wrapper = shallow(<Status {...propsWithSignedTx} />);
    expect(wrapper.find(TransactionResult).props()).toEqual({
      illustration: 'signMultisignature',
      status: { code: 'MULTISIG_SIGNATURE_SUCCESS' },
      title: 'The transaction is now fully signed',
      message: 'Now you can send it to the blockchain. You may also copy or download it, if you wish to send the transaction using another device later.',
      className: 'content',
    });
  });
});
