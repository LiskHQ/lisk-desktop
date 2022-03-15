import React from 'react';
import { mount } from 'enzyme';
import { secondPassphraseRemoved } from '@actions';
import TransactionSignature from './transactionSignature';
import accounts from '../../../../test/constants/accounts';

jest.mock('@actions', () => ({
  secondPassphraseRemoved: jest.fn(),
}));

describe('TransactionSignature', () => {
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
    rawTransaction: {},
    nextStep: jest.fn(),
    statusInfo: {},
    sender: { data: accounts.genesis },
    transactionDoubleSigned: jest.fn(),
  };

  it('should call multisigTransactionSigned', () => {
    mount(<TransactionSignature {...props} />);
    expect(props.multisigTransactionSigned).toHaveBeenCalledWith({
      rawTransaction: props.rawTransaction,
      sender: props.sender,
    });
  });

  it('should call actionFunction', () => {
    mount(<TransactionSignature {...props} sender={undefined} />);
    expect(props.actionFunction).toHaveBeenCalledWith({});
  });

  it('should call nextStep with props', () => {
    const wrapper = mount(<TransactionSignature {...props} />);

    wrapper.setProps({
      transactions: {
        ...props.transactions,
        signedTransaction: { signatures: [accounts.genesis.summary.publicKey] },
      },
    });
    wrapper.update();
    expect(props.nextStep).toHaveBeenCalledWith({
      rawTransaction: props.rawTransaction,
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
      rawTransaction: props.rawTransaction,
      statusInfo: props.statusInfo,
      sender: props.sender,
    });
  });

  it('should call transactionDoubleSigned with props', () => {
    const wrapper = mount(
      <TransactionSignature
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
    const wrapper = mount(<TransactionSignature {...props} />);
    expect(wrapper.html()).toEqual('<div></div>');
  });

  it('should render properly when account is hardware wallet', () => {
    const wrapper = mount(
      <TransactionSignature
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
      <TransactionSignature
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
