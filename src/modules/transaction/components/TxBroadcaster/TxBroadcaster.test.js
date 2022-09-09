import React from 'react';
import { mount } from 'enzyme';
import { txStatusTypes } from '@transaction/configuration/txStatus';
import accounts from '@tests/constants/wallets';
import TxBroadcaster from './TxBroadcaster';
import Regular from '../Regular';
import Multisignature from '../Multisignature';

describe('TxBroadcaster', () => {
  const props = {
    transactions: {
      txBroadcastError: null,
      txSignatureError: null,
      signedTransaction: {
        senderPublicKey: accounts.genesis.summary.publicKey,
        signatures: [accounts.genesis.summary.publicKey],
      },
    },
    account: accounts.genesis,
    network: {},
    transactionBroadcasted: jest.fn(),
    resetTransactionResult: jest.fn(),
    status: {
      code: txStatusTypes.signatureSuccess,
    },
    t: (t) => t,
    illustration: 'default',
  };

  it('should render Regular component with props', () => {
    const wrapper = mount(<TxBroadcaster {...props} />);
    expect(wrapper.find(Regular)).toExist();
    expect(wrapper.find(Multisignature)).not.toExist();
  });

  it('should render Multisignature component with props', () => {
    const customProps = {
      ...props,
      transactions: {
        txBroadcastError: null,
        txSignatureError: null,
        signedTransaction: {
          senderPublicKey: accounts.multiSig.summary.publicKey,
          signatures: [accounts.multiSig.summary.publicKey, ''],
        },
      },
      account: accounts.multiSig,
    };
    const wrapper = mount(<TxBroadcaster {...customProps} />);
    expect(wrapper.find(Multisignature)).toExist();
    expect(wrapper.find(Regular)).not.toExist();
  });
});
