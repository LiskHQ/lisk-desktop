import React from 'react';
import { mount } from 'enzyme';
import { secondPassphraseRemoved } from '@auth/store/action';
import accounts from '@tests/constants/wallets';
import { mockAccount as mockCurrentAccount } from '@account/utils';
import flushPromises from '@tests/unit-test-utils/flushPromises';
import { act } from 'react-dom/test-utils';
import TxSignatureCollector from './TxSignatureCollector';

const mockSetCurrentAccount = jest.fn();
jest.mock('@auth/store/action', () => ({
  secondPassphraseRemoved: jest.fn(),
}));
jest.mock('@account/hooks', () => ({
  useCurrentAccount: jest.fn(() => ([mockCurrentAccount, mockSetCurrentAccount])),
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

  it('should call multisigTransactionSigned', async () => {
    const wrapper = mount(<TxSignatureCollector {...props} />);
    wrapper.find('input').simulate('change', { target: { value: 'pass' } });
    wrapper.find('form').simulate('submit');
    await flushPromises();
    act(() => { wrapper.update(); });
    expect(props.multisigTransactionSigned).toHaveBeenCalledWith({
      rawTx: props.rawTx,
      sender: props.sender,
      privateKey: 'private-key-mock',
      publicKey: mockCurrentAccount.metadata.pubkey,
    });
  });

  it('should call actionFunction', async () => {
    const wrapper = mount(<TxSignatureCollector {...props} sender={undefined} />);
    wrapper.find('input').simulate('change', { target: { value: 'pass' } });
    wrapper.find('form').simulate('submit');
    await flushPromises();
    act(() => { wrapper.update(); });
    const privateKey = 'private-key-mock';
    const publicKey = mockCurrentAccount.metadata.pubkey;
    expect(props.actionFunction).toHaveBeenCalledWith({}, privateKey, publicKey);
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

  it('should render enter password form when it is not a hardware wallet', () => {
    const wrapper = mount(<TxSignatureCollector {...props} />);
    expect(wrapper.find('h1')).toHaveText('Enter your password');
    expect(wrapper.find('input')).toExist();
    expect(wrapper.find('.continue-btn')).toExist();
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
