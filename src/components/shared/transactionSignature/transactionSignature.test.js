import React from 'react';
import { mount } from 'enzyme';
import TransactionSignature from './transactionSignature';
import accounts from '../../../../test/constants/accounts';

describe('unlock transaction Status', () => {
  const props = {
    t: key => key,
    transactions: {
      txBroadcastError: null,
      txSignatureError: null,
      signedTransaction: { signatures: ['123'] },
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
});
