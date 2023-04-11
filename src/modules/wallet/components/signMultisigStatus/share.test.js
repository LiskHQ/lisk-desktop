import React from 'react';
import { shallow } from 'enzyme';
import TxBroadcaster from '@transaction/components/TxBroadcaster';
import accounts from '@tests/constants/wallets';
import { mockAuth } from '@auth/__fixtures__';
import useTxInitiatorAccount from '@transaction/hooks/useTxInitiatorAccount';
import Status from './status';

jest.mock('@libs/wcm/hooks/useSession', () => ({
  respond: jest.fn(),
}));
jest.mock('@transaction/hooks/useTxInitiatorAccount');

describe('Sign Multisignature Tx Status component', () => {
  const props = {
    t: (str, dict) => (dict ? str.replace('{{errorMessage}}', dict.errorMessage) : str),
    sender: { data: accounts.multiSig },
    transactions: {
      txBroadcastError: null,
      txSignatureError: null,
      signedTransaction: {},
    },
    transactionJSON: {
      senderPublicKey: accounts.multiSig.summary.publicKey,
      signatures: [accounts.multiSig.summary.publicKey],
      nonce: '19',
      fee: '207000',
      module: 'auth',
      command: 'registerMultisignature',
      params: {
        optionalKeys: accounts.multiSig.keys.optionalKeys,
        mandatoryKeys: accounts.multiSig.keys.mandatoryKeys,
        numberOfSignatures: accounts.multiSig.keys.numberOfSignatures,
        signatures: [],
      },
    },
  };

  const signedTransaction = {
    senderPublicKey: accounts.multiSig.summary.publicKey,
    signatures: [accounts.multiSig.summary.publicKey],
    nonce: '19n',
    fee: '207000n',
    module: 'auth',
    command: 'registerMultisignature',
    params: {
      optionalKeys: accounts.multiSig.keys.optionalKeys,
      mandatoryKeys: accounts.multiSig.keys.mandatoryKeys,
      numberOfSignatures: accounts.multiSig.keys.numberOfSignatures,
      signatures: [],
    },
  };

  useTxInitiatorAccount.mockReturnValue({
    txInitiatorAccount: { ...mockAuth.data, ...mockAuth.meta, keys: { ...mockAuth.data } },
    isLoading: false,
  });

  // @todo reinstate by #4506.
  it.skip('passes correct props to TxBroadcaster when transaction sign failed', () => {
    const propsWithError = {
      ...props,
      transactions: {
        txBroadcastError: null,
        txSignatureError: { message: 'error:test' },
        signedTransaction: { signatures: ['123'] },
      },
    };

    const wrapper = shallow(<Status {...propsWithError} />);
    expect(wrapper.find(TxBroadcaster).props()).toEqual({
      illustration: 'signMultisignature',
      status: { code: 'SIGNATURE_ERROR', message: JSON.stringify({ message: 'error:test' }) },
      title: 'Transaction failed',
      message: 'An error occurred while signing your transaction. Please try again.',
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
    expect(wrapper.find(TxBroadcaster).props()).toMatchObject({
      illustration: 'signMultisignature',
      status: { code: 'BROADCAST_SUCCESS' },
      title: 'Transaction submitted',
      className: 'content',
    });
  });

  it('passes correct props to TxBroadcaster when transaction broadcast fails', () => {
    const propsWithError = {
      ...props,
      transactions: {
        txBroadcastError: { message: 'error:test' },
        txSignatureError: null,
        signedTransaction: {},
      },
    };

    const wrapper = shallow(<Status {...propsWithError} />);
    expect(wrapper.find(TxBroadcaster).props()).toEqual({
      illustration: 'signMultisignature',
      status: { code: 'BROADCAST_ERROR', message: JSON.stringify({ message: 'error:test' }) },
      title: 'Transaction failed',
      message: 'An error occurred while sending your transaction to the network. Please try again.',
      className: 'content',
    });
  });

  it('passes correct props to TxBroadcaster when partial signed transaction', () => {
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
    expect(wrapper.find(TxBroadcaster).props()).toEqual({
      illustration: 'signMultisignature',
      status: { code: 'MULTISIG_SIGNATURE_PARTIAL_SUCCESS' },
      title: 'Your signature was successful',
      message: 'You can download or copy the transaction and share it with other members.',
      className: 'content',
    });
  });

  // @todo reinstate by #4506.
  it.skip('passes correct props to TxBroadcaster when fully signed transaction', () => {
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
    expect(wrapper.find(TxBroadcaster).props()).toEqual({
      illustration: 'signMultisignature',
      status: { code: 'MULTISIG_SIGNATURE_SUCCESS' },
      title: 'The transaction is now fully signed',
      message:
        'Now you can send it to the network. You may also copy or download it, if you wish to send the transaction using another device later.',
      className: 'content',
    });
  });
});
