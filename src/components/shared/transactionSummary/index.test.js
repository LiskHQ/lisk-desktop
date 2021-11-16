import React from 'react';
import { mount } from 'enzyme';
import accounts from '../../../../test/constants/accounts';
import TransactionSummary from './transactionSummary';

describe('TransactionSummary', () => {
  let props;
  const hwInfo = {
    deviceModel: 'Trezor Model T',
    deviceId: 'mock id',
  };

  beforeEach(() => {
    props = {
      title: 'mock title',
      account: accounts.genesis,
      confirmButton: {
        label: 'Confirm',
        onClick: jest.fn(),
      },
      cancelButton: {
        label: 'Cancel',
      },
      t: key => key,
    };
  });

  it('should render title', () => {
    const wrapper = mount(<TransactionSummary {...props} />);
    expect(wrapper.find('h2').text()).toEqual(props.title);
  });

  it('should render hw wallet confirmation if props.account.hwInfo', () => {
    const wrapper = mount(<TransactionSummary {...{
      ...props,
      account: { ...accounts.genesis, hwInfo },
    }}
    />);
    expect(wrapper.find('h2')).toIncludeText('Confirm transaction on your');
    // TODO need to handle the summary for HW
    // expect(wrapper.find('.confirm-button')).toHaveLength(0);
    expect(props.confirmButton.onClick).toHaveBeenCalled();
  });

  it('should not render hw wallet confirmation if props.account.hwInfo and props.confirmButton.disabled', () => {
    const wrapper = mount(<TransactionSummary {...{
      ...props,
      confirmButton: {
        ...props.confirmButton,
        disabled: true,
      },
      account: { ...accounts.genesis, hwInfo },
    }}
    />);
    expect(wrapper.find('h2')).toIncludeText('Confirm transaction on your');
    // TODO need to handle the summary for HW
    // expect(wrapper.find('.confirm-button')).toHaveLength(0);
    expect(props.confirmButton.onClick).not.toHaveBeenCalled();
    wrapper.unmount();
  });

  it('should render copy/download buttons', () => {
    const wrapper = mount(<TransactionSummary {... {
      ...props,
      account: {
        ...props.account,
        summary: {
          ...props.account.summary,
          isMultisignature: true,
        },
      },
    }}
    />);
    expect(wrapper.find('.cancel-button').exists()).toBeTruthy();
    expect(wrapper.find('.copy-button').exists()).toBeTruthy();
    expect(wrapper.find('.download-button').exists()).toBeTruthy();
    expect(wrapper.find('.confirm-button').exists()).toBeFalsy();
  });

  it('should call props.createTransaction', () => {
    const createTransaction = jest.fn();
    const wrapper = mount(<TransactionSummary {... {
      ...props,
      account: {
        ...props.account,
        summary: {
          ...props.account.summary,
          isMultisignature: true,
        },
      },
      createTransaction,
    }}
    />);
    wrapper.find('.copy-button').at(0).simulate('click');
    expect(createTransaction).toHaveBeenCalledTimes(1);
    wrapper.find('.download-button').at(0).simulate('click');
    expect(createTransaction).toHaveBeenCalledTimes(2);
  });
});
