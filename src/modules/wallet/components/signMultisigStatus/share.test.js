import React from 'react';
import { shallow } from 'enzyme';
import TxBroadcaster from '@transaction/components/TxBroadcaster';
import accounts from '@tests/constants/wallets';
import { mockAuth } from '@auth/__fixtures__';
import useTxInitiatorAccount from '@transaction/hooks/useTxInitiatorAccount';
import { useValidators } from '@pos/validator/hooks/queries';
import { mockValidators } from '@pos/validator/__fixtures__';
import DialogLink from '@theme/dialog/link';
import { mockAppsTokens } from '@token/fungible/__fixtures__';
import Status from './status';

jest.mock('@libs/wcm/hooks/useSession', () => ({
  respond: jest.fn(),
}));
jest.mock('@transaction/hooks/useTxInitiatorAccount');
jest.mock('@pos/validator/hooks/queries/useValidators');

describe('Sign Multisignature Tx Status component', () => {
  const mockFetchNextValidators = jest.fn();
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
    account: accounts.multiSig,
    bookmarks: { LSK: [] },
    token: 'LSK',
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
  useValidators.mockReturnValue({
    data: mockValidators,
    isFetching: false,
    fetchNextPage: mockFetchNextValidators,
    hasNextPage: false,
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

  it('should shows bookmark', () => {
    const propsSuccess = {
      ...props,
      transactions: {
        txBroadcastError: null,
        txSignatureError: null,
        signedTransaction: {},
      },
      transactionJSON: {
        senderPublicKey: accounts.genesis.summary.publicKey,
        signatures: [accounts.genesis.summary.publicKey],
        nonce: '20',
        fee: '164000',
        module: 'token',
        command: 'transfer',
        params: {
          tokenID: mockAppsTokens.data[0].tokenID,
          amount: 1000000,
          recipientAddress: accounts.genesis.summary.address,
          data: '',
        },
      },
      bookmarks: {
        LSK: [],
      },
    };

    const wrapper = shallow(<Status {...propsSuccess} />);
    expect(wrapper.find(DialogLink));
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
    expect(wrapper.find(TxBroadcaster).props()).toEqual(
      expect.objectContaining({
        illustration: 'signMultisignature',
        status: {
          code: 'BROADCAST_ERROR',
          message: JSON.stringify({ transaction: {}, error: 'error:test' }),
        },
        title: 'Transaction failed',
        message:
          'An error occurred while sending your transaction to the network. Please try again.',
        className: 'content',
      })
    );
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
    expect(wrapper.find(TxBroadcaster).props()).toEqual(
      expect.objectContaining({
        illustration: 'signMultisignature',
        status: { code: 'MULTISIG_SIGNATURE_PARTIAL_SUCCESS' },
        title: 'The transaction is partially signed',
        message:
          'Your signature has been successfully included in the transaction. Kindly copy or download the partially signed transaction and share it with the remaining members to collect all required signatures before broadcasting.',
        className: 'content',
      })
    );
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
    expect(wrapper.find(TxBroadcaster).props()).toEqual(
      expect.objectContaining({
        illustration: 'signMultisignature',
        status: { code: 'MULTISIG_SIGNATURE_SUCCESS' },
        title: 'The transaction is now fully signed',
        message:
          'Now you can send it to the network. You may also copy or download it, if you wish to send the transaction using another device later.',
        className: 'content',
      })
    );
  });
});
