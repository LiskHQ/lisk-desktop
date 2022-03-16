import React from 'react';
import { mount } from 'enzyme';
import accounts from '../../../../test/constants/accounts';
import TransactionSummary from './transactionSummary';

describe('TransactionSummary', () => {
  let props;

  beforeEach(() => {
    props = {
      title: 'mock title',
      account: accounts.genesis,
      token: 'LSK',
      confirmButton: {
        label: 'Confirm',
        onClick: jest.fn(),
      },
      cancelButton: {
        label: 'Cancel',
        onClick: jest.fn(),
      },
      t: key => key,
    };
  });

  it('should render title', () => {
    const wrapper = mount(<TransactionSummary {...props} />);
    expect(wrapper.find('h2').text()).toEqual(props.title);
  });

  it('should call action functions of each button', () => {
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
    wrapper.find('.confirm-button').at(0).simulate('click');
    expect(props.confirmButton.onClick).toHaveBeenCalled();
    wrapper.find('.cancel-button').at(0).simulate('click');
    expect(props.cancelButton.onClick).toHaveBeenCalled();
  });
});
