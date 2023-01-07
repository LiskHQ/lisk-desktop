import React from 'react';
import { shallow } from 'enzyme';
import { mountWithRouterAndQueryClient } from 'src/utils/testHelpers';
import TxBroadcaster from '@transaction/components/TxBroadcaster';
import accounts from '@tests/constants/wallets';
import { useCommandSchema } from '@network/hooks';
import { mockCommandParametersSchemas } from 'src/modules/common/__fixtures__';
import Status from './Status';

jest.mock('@libs/wcm/hooks/useSession', () => ({
  respond: jest.fn(),
}));
jest.mock('@network/hooks');

describe('Status', () => {
  const props = {
    t: (v) => v,
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
    id: 'legacy:reclaim',
    senderPublicKey: accounts.non_migrated.summary.publicKey,
    signatures: [accounts.non_migrated.summary.publicKey],
    nonce: '19n',
    fee: '207000n',
  };

  useCommandSchema.mockReturnValue(
    mockCommandParametersSchemas.data.reduce(
      (result, { moduleCommand, schema }) => ({ ...result, [moduleCommand]: schema }),
      {}
    )
  );

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
    expect(wrapper.find('.status-container')).toExist();
    expect(wrapper.find(TxBroadcaster).props()).toMatchObject({
      illustration: 'default',
      status: { code: 'SIGNATURE_SUCCESS' },
      title: 'Submitting the transaction',
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
    expect(wrapper.find('.status-container')).toExist();
    expect(wrapper.find(TxBroadcaster).props()).toMatchObject({
      illustration: 'default',
      status: { code: 'SIGNATURE_ERROR', message: JSON.stringify({ message: 'error:test' }) },
      title: 'Transaction failed',
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
    expect(wrapper.find('.status-container')).toExist();
    expect(wrapper.find(TxBroadcaster).props()).toMatchObject({
      illustration: 'default',
      status: { code: 'BROADCAST_ERROR', message: JSON.stringify({ message: 'error:test' }) },
      title: 'Reclaim LSK tokens failed',
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

    const wrapper = mountWithRouterAndQueryClient(Status, propsSuccess);

    expect(wrapper.find('.status-container')).toExist();
    expect(wrapper.find(TxBroadcaster).props()).toMatchObject({
      illustration: 'default',
      status: { code: 'BROADCAST_SUCCESS' },
      title: 'Reclaimed LSK tokens',
      className: 'content',
    });
  });
});
