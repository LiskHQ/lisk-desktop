import React from 'react';
import { mount } from 'enzyme';
import { secondPassphraseRemoved } from '@auth/store/action';
import accounts from '@tests/constants/wallets';
import TxSignatureCollector from './TxSignatureCollector';

jest.mock('@auth/store/action', () => ({
  secondPassphraseRemoved: jest.fn(),
}));

describe('TxSignatureCollector', () => {
  const props = {
    t: key => key,
    transactions: {
      txBroadcastError: null,
      txSignatureError: null,
      signedTransaction: { },
    },
    account: accounts.genesis,
    actionFunction: jest.fn(),
    multisigTransactionSigned: jest.fn(),
    rawTx: {},
    nextStep: jest.fn(),
    statusInfo: {},
    sender: { data: accounts.genesis },
    transactionDoubleSigned: jest.fn(),
  };

  it('should call multisigTransactionSigned', () => {
    mount(<TxSignatureCollector {...props} />);
    expect(props.multisigTransactionSigned).toHaveBeenCalledWith({
      rawTx: props.rawTx,
      sender: props.sender,
    });
  });

  it('should call actionFunction', () => {
    mount(<TxSignatureCollector {...props} sender={undefined} />);
    expect(props.actionFunction).toHaveBeenCalledWith({});
  });

  it('should call nextStep with props', () => {
    const wrapper = mount(<TxSignatureCollector {...props} />);

    wrapper.setProps({
      transactions: {
        ...props.transactions,
        signedTransaction: { signatures: [accounts.genesis.summary.publicKey] },
      },
    });
    wrapper.update();
    expect(props.nextStep).toHaveBeenCalledWith({
      rawTx: props.rawTx,
      statusInfo: props.statusInfo,
      sender: props.sender,
    });

    wrapper.setProps({
      transactions: {
        ...props.transactions,
        txSignatureError: { },
      },
    });
    wrapper.update();
    expect(props.nextStep).toHaveBeenCalledWith({
      rawTx: props.rawTx,
      statusInfo: props.statusInfo,
      sender: props.sender,
    });
  });

  it('should call transactionDoubleSigned with props', () => {
    const wrapper = mount(
      <TxSignatureCollector
        {...props}
        account={{
          ...props.account,
          secondPassphrase: accounts.delegate.passphrase,
        }}
      />,
    );

    wrapper.setProps({
      transactions: {
        ...props.transactions,
        signedTransaction: { signatures: [accounts.genesis.summary.publicKey, ''] },
      },
    });
    wrapper.update();
    expect(props.transactionDoubleSigned).toHaveBeenCalled();
  });

  it('should render empty div when is not hardware wallet', () => {
    const wrapper = mount(<TxSignatureCollector {...props} />);
    expect(wrapper.html()).toEqual('<div></div>');
  });

  it('should render properly when account is hardware wallet', () => {
    const wrapper = mount(
      <TxSignatureCollector
        {...props}
        account={{
          ...accounts.genesis,
          hwInfo: { deviceModel: 'ledgerNano' },
        }}
      />,
    );
    expect(wrapper.find('.hwConfirmation')).toExist();
    expect(wrapper.find('h5')).toHaveText('Please confirm the transaction on your {{deviceModel}}');
  });

  it('should unmount and remove stored second passphrase if it exists', () => {
    const wrapper = mount(
      <TxSignatureCollector
        {...props}
        account={{
          ...accounts.genesis,
          secondPassphrase: 'pen hawk chunk better gadget flat picture wait exclude zero hung broom',
        }}
      />,
    );
    wrapper.unmount();
    expect(secondPassphraseRemoved).toBeCalledTimes(1);
    expect(wrapper).not.toExist();
  });
});
