import React from 'react';
import { mount } from 'enzyme';
import accounts from '../../../../test/constants/accounts';
import TransactionSummary from './transactionSummary';

const hwInfo = {
  deviceModel: 'Trezor Model T',
  deviceId: 'mock id',
};
const ordinaryAccount = { info: { LSK: accounts.genesis } };
const multisigAccount = {
  info: {
    LSK: {
      ...accounts.genesis,
      summary: {
        ...accounts.genesis.summary,
        isMultisignature: true,
      },
    },
  },
};
const accountWithHW = {
  info: {
    LSK: {
      ...accounts.genesis,
      hwInfo,
    },
  },
};

describe('TransactionSummary', () => {
  const props = {
    title: 'mock title',
    account: ordinaryAccount,
    confirmButton: {
      label: 'Confirm',
      onClick: jest.fn(),
    },
    cancelButton: {
      label: 'Cancel',
      onClick: jest.fn(),
    },
    t: key => key,
    token: 'LSK',
    createTransaction: jest.fn(),
    fee: '10000',
  };

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should render title', () => {
    const wrapper = mount(<TransactionSummary {...props} />);
    expect(wrapper.find('h2').text()).toEqual(props.title);
  });

  it('should render hw wallet confirmation if props.account.hwInfo', () => {
    const wrapper = mount(<TransactionSummary {...{
      ...props,
      account: accountWithHW,
    }}
    />);
    expect(wrapper.find('h2')).toIncludeText('Confirm transaction on your');
    expect(wrapper.find('.confirm-button')).toHaveLength(0);
    expect(props.confirmButton.onClick).toHaveBeenCalled();
  });

  it('should not render hw wallet confirmation if props.account.hwInfo and props.confirmButton.disabled', () => {
    const wrapper = mount(<TransactionSummary {...{
      ...props,
      confirmButton: {
        ...props.confirmButton,
        disabled: true,
      },
      account: accountWithHW,
    }}
    />);
    expect(wrapper.find('h2')).toIncludeText('Confirm transaction on your');
    expect(wrapper.find('.confirm-button')).toHaveLength(0);
    expect(props.confirmButton.onClick).not.toHaveBeenCalled();
    wrapper.unmount();
  });

  it('should render copy/download buttons for multisig accounts', () => {
    const wrapper = mount(<TransactionSummary {... {
      ...props,
      account: multisigAccount,
    }}
    />);
    expect(wrapper.find('.cancel-button').exists()).toBeTruthy();
    expect(wrapper.find('.copy-button').exists()).toBeTruthy();
    expect(wrapper.find('.download-button').exists()).toBeTruthy();
    expect(wrapper.find('.confirm-button').exists()).toBeFalsy();
  });

  it('should call props.createTransaction', () => {
    const createTransaction = jest.fn();
    mount(<TransactionSummary {... {
      ...props,
      account: multisigAccount,
      createTransaction,
    }}
    />);
    expect(createTransaction).toHaveBeenCalledTimes(1);
  });
});
