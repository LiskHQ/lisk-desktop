import React from 'react';
import { shallow } from 'enzyme';
import accounts from '@tests/constants/wallets';
import {LEDGER_HW_IPC_CHANNELS} from "@libs/hardwareWallet/ledger/constants";
import Status from './UnlockBalanceStatus';

jest.mock('@libs/wcm/hooks/useSession', () => ({
  respond: jest.fn(),
}));
describe('unlock transaction Status', () => {
  const props = {
    t: key => key,
    account: accounts.genesis,
    transactions: {
      txBroadcastError: null,
      txSignatureError: null,
      signedTransaction: { signatures: ['123'] },
    },
  };

  const signedTransaction = {
    id: 'pos:unlock',
    senderPublicKey: accounts.genesis.summary.publicKey,
    signatures: [accounts.genesis.summary.publicKey],
    nonce: '19n',
    fee: '207000n',
  };

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
    expect(wrapper.props().children.props).toEqual({
      illustration: 'default',
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

    let wrapper = shallow(<Status {...propsWithError} />);
    expect(wrapper.props().children.props).toEqual({
      illustration: 'default',
      status: { code: 'SIGNATURE_ERROR', message: JSON.stringify({ message: 'error:test' }) },
      title: 'Transaction failed',
      message: 'An error occurred while signing your transaction. Please try again.',
      className: 'content',
    });

    const propsWithHWError = {
      ...props,
      transactions: {
        txBroadcastError: null,
        txSignatureError: { message: LEDGER_HW_IPC_CHANNELS.GET_SIGNED_TRANSACTION },
        signedTransaction: { signatures: ['123'] },
      },
    };

    wrapper = shallow(<Status {...propsWithHWError} />);
    expect(wrapper.props().children.props).toEqual({
      illustration: 'default',
      status: { code: 'HW_REJECTED', message: LEDGER_HW_IPC_CHANNELS.GET_SIGNED_TRANSACTION },
      title: 'Transaction aborted on device',
      message: 'You have cancelled the transaction on your hardware wallet.',
      className: 'content',
    });
  });

  it('passes correct props to TxBroadcaster when transaction broadcast fails', () => {
    const propsWithError = {
      ...props,
      transactions: {
        txBroadcastError: { message: 'error:test' },
        txSignatureError: null,
        signedTransaction: { },
      },
    };

    const wrapper = shallow(<Status {...propsWithError} />);
    expect(wrapper.props().children.props).toEqual({
      illustration: 'default',
      status: { code: 'BROADCAST_ERROR', message: JSON.stringify({ message: 'error:test' }) },
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
        signedTransaction: { },
      },
    };

    const wrapper = shallow(<Status {...propsSuccess} />);
    expect(wrapper.props().children.props).toMatchObject({
      illustration: 'default',
      status: { code: 'BROADCAST_SUCCESS' },
      title: 'Transaction submitted',
      className: 'content',
    });
  });
});
