import React from 'react';
import { shallow } from 'enzyme';
import accounts from '@tests/constants/wallets';
import { LEDGER_HW_IPC_CHANNELS } from '@libs/hardwareWallet/ledger/constants';
import { posUnlock, getTransactionObject } from '@tests/fixtures/transactions';
import Status from './UnlockBalanceStatus';

jest.mock('@libs/wcm/hooks/useSession', () => ({
  respond: jest.fn(),
}));

describe('unlock transaction Status', () => {
  const mockPrevStep = jest.fn();

  const props = {
    t: (key) => key,
    account: accounts.genesis,
    prevStep: mockPrevStep,
    transactions: {
      txBroadcastError: null,
      txSignatureError: null,
      signedTransaction: { ...getTransactionObject(posUnlock) },
    },
  };

  it('passes correct props to TxBroadcaster when signed transaction', () => {
    const wrapper = shallow(<Status {...props} />);
    expect(wrapper.props().children.props).toEqual({
      illustration: 'default',
      status: { code: 'SIGNATURE_SUCCESS' },
      title: 'Submitting the transaction',
      message: 'Your transaction is signed successfully.',
    });
  });

  it('passes correct props to TxBroadcaster when transaction sign failed', () => {
    const propsWithError = {
      ...props,
      transactions: {
        ...props.transactions,
        txBroadcastError: null,
        txSignatureError: { message: 'error:test' },
      },
    };

    let wrapper = shallow(<Status {...propsWithError} />);
    expect(wrapper.props().children.props).toEqual({
      illustration: 'default',
      status: { code: 'SIGNATURE_ERROR', message: JSON.stringify({ error: 'error:test' }) },
      title: 'Transaction failed',
      message: 'An error occurred while signing your transaction. Please try again.',
      onRetry: expect.any(Function),
    });

    const propsWithHWError = {
      ...props,
      transactions: {
        ...props.transactions,
        txBroadcastError: null,
        txSignatureError: {
          message: LEDGER_HW_IPC_CHANNELS.GET_SIGNED_TRANSACTION,
          hwTxStatusType: 'HW_REJECTED',
        },
      },
    };

    wrapper = shallow(<Status {...propsWithHWError} />);
    expect(wrapper.props().children.props).toEqual({
      illustration: 'default',
      status: { code: 'HW_REJECTED', message: LEDGER_HW_IPC_CHANNELS.GET_SIGNED_TRANSACTION },
      title: 'Transaction aborted on device',
      message: 'You have cancelled the transaction on your hardware wallet.',
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
    expect(wrapper.props().children.props).toEqual({
      illustration: 'default',
      status: { code: 'BROADCAST_ERROR', message: { error: 'error:test', transaction: posUnlock } },
      title: 'Transaction failed',
      message: 'An error occurred while sending your transaction to the network. Please try again.',
      onRetry: expect.any(Function),
      children: undefined,
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
    expect(wrapper.props().children.props).toMatchObject({
      illustration: 'default',
      status: { code: 'BROADCAST_SUCCESS' },
      title: 'Transaction submitted',
    });
  });
});
