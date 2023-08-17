import React from 'react';
import { shallow } from 'enzyme';
import TxBroadcaster from '@transaction/components/TxBroadcaster';
import DialogLink from 'src/theme/dialog/link';
import accounts from '@tests/constants/wallets';
import { act } from 'react-dom/test-utils';
import flushPromises from '@tests/unit-test-utils/flushPromises';
import { mountWithRouterAndStore } from 'src/utils/testHelpers';
import { useValidators } from '@pos/validator/hooks/queries';
import { mockValidators } from '@pos/validator/__fixtures__';
import Status from './Status';

jest.mock('@libs/wcm/hooks/useSession', () => ({
  respond: jest.fn(),
}));
jest.mock('@pos/validator/hooks/queries');

describe('Sent token Status', () => {
  const props = {
    t: (key) => key,
    account: accounts.genesis,
    recipientAccount: { data: accounts.validator },
    rawTx: {
      params: {
        recipient: { address: accounts.validator.summary.address },
      },
    },
    transactions: {
      txBroadcastError: null,
      txSignatureError: null,
      signedTransaction: { signatures: ['123'], params: {} },
    },
    bookmarks: {
      LSK: [],
    },
    token: 'LSK',
    transactionJSON: {
      nonce: '19n',
      module: 'token',
      command: 'transfer',
      params: {
        recipientAddress: accounts.validator.summary.address,
      },
      id: 'test_id',
      signatures: [accounts.genesis.summary.publicKey],
    },
  };

  const signedTransaction = {
    module: 'pos',
    command: 'claimRewards',
    nonce: '7339636738092037709',
    fee: '9886722176580209175',
    senderPublicKey: 'bfbef2a36e17ca75b66fd56adea8dd04ed234cd4188aca42fc8a7299d8eaadd8',
    params: {},
    signatures: [
      'fc64c70fae22047b49d88fb88097dfa3c3c3180d4bf264aa1ef0cc33bfe9a8c0caa1ef5213befd39520cad1de7c6f6d45915b7dccb39f92695db3aed34df0ba7',
    ],
  };

  useValidators.mockReturnValue({ data: mockValidators });

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
      message: 'Your transaction is signed successfully.',
    });
    expect(wrapper.find(DialogLink).props()).toMatchObject({
      component: 'addBookmark',
      data: {
        formAddress: 'lskehj8am9afxdz8arztqajy52acnoubkzvmo9cjy',
        isValidator: true,
        label: 'gr33ndrag0n_0',
      },
    });
  });

  it('passes correct props to TxBroadcaster when transaction sign failed', () => {
    const propsWithError = {
      ...props,
      transactions: {
        txBroadcastError: null,
        txSignatureError: { message: 'error:test' },
        signedTransaction,
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
      message: 'An error occurred while signing your transaction. Please try again.',
    });
  });

  it.only('passes correct props to TxBroadcaster when transaction broadcast fails', () => {
    const propsWithError = {
      ...props,
      transactions: {
        ...props.transactions,
        txBroadcastError: { error: 'error:test', transaction: signedTransaction },
        txSignatureError: null,
      },
    };

    const wrapper = shallow(<Status {...propsWithError} />);
    expect(wrapper.find(TxBroadcaster).props()).toMatchObject({
      illustration: 'default',
      status: {
        code: 'BROADCAST_ERROR',
        message: JSON.stringify({ transaction: signedTransaction, error: 'error:test' }),
      },
      title: 'Transaction failed',
      message: 'An error occurred while sending your transaction to the network. Please try again.',
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
      message:
        'Your transaction is submitted to network, you can now track the status of this transaction in your wallet.',
      title: 'Transaction submitted',
    });
    expect(wrapper.find(DialogLink).props()).toMatchObject({
      component: 'addBookmark',
      data: {
        formAddress: 'lskehj8am9afxdz8arztqajy52acnoubkzvmo9cjy',
        isValidator: true,
        label: 'gr33ndrag0n_0',
      },
    });
  });

  it('should not show bookmark button if sent to self', () => {
    const propsToSelf = {
      ...props,
      account: accounts.validator,
    };

    const wrapper = shallow(<Status {...propsToSelf} />);
    expect(wrapper.find('.bookmark-container')).not.toExist();
  });

  it('should not show bookmark button if already a bookmark', () => {
    const propsWithBookmarks = {
      ...props,
      bookmarks: {
        LSK: [{ address: accounts.validator.summary.address }],
      },
    };

    const wrapper = shallow(<Status {...propsWithBookmarks} />);
    expect(wrapper.find('.bookmark-container')).not.toExist();
  });

  it.skip('should load recipient info if not broadcasted yet', async () => {
    const propsNotBroadcasted = {
      ...props,
      transactions: {
        txBroadcastError: null,
        txSignatureError: null,
        signedTransaction: { signatures: ['123'] },
      },
      recipientAccount: {
        data: accounts.validator,
        loadData: jest.fn(),
      },
    };

    // @todo This should work and fix the missing coverage but
    // the Redux connect mock doesn't seem to merge the state correctly
    const wrapper = mountWithRouterAndStore(
      Status,
      propsNotBroadcasted,
      {},
      {
        transactions: {
          txBroadcastError: null,
          txSignatureError: null,
          signedTransaction: { signatures: ['123'] },
        },
      }
    );
    await flushPromises();
    act(() => {
      wrapper.update();
    });
    expect(propsNotBroadcasted.recipientAccount.loadData).toHaveBeenCalled();
  });
});
