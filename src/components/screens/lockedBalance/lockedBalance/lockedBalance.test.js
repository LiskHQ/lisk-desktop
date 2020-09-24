import React from 'react';
import { mount } from 'enzyme';
import LockedBalance from './lockedBalance';
import accounts from '../../../../../test/constants/accounts';
import useTransactionPriority from '../../send/form/useTransactionPriority';
import useTransactionFeeCalculation from '../../send/form/useTransactionFeeCalculation';

jest.mock('../../send/form/useTransactionPriority');
jest.mock('../../send/form/useTransactionFeeCalculation');

describe('Unlock LSK modal', () => {
  let wrapper;
  useTransactionPriority.mockImplementation(() => (
    [
      { selectedIndex: 1 },
      () => {},
      [
        { title: 'Low', value: 0.001 },
        { title: 'Medium', value: 0.005 },
        { title: 'High', value: 0.01 },
        { title: 'Custom', value: undefined },
      ],
    ]
  ));
  useTransactionFeeCalculation.mockImplementation(() => ({
    fee: {},
    maxAmount: 0.1,
    minFee: 0.001,
  }));

  const props = {
    account: {
      ...accounts.genesis,
      delegate: {},
    },
    prevState: {},
    nextStep: jest.fn(),
    transactionCreated: jest.fn(),
    t: key => key,
  };

  beforeEach(() => {
    wrapper = mount(<LockedBalance {...props} />);
  });

  it('renders properly LockedBalance component', () => {
    expect(wrapper).toContainMatchingElement('.lock-balance-amount-container');
    expect(wrapper).toContainMatchingElement('.transaction-priority');
    expect(wrapper).toContainMatchingElement('.unlock-btn');
  });

  it('renders properly Status component when transaction failed on being submitted and call props.transactionBroadcasted', () => {
    wrapper.find('.unlock-btn').at(0).simulate('click');
    expect(props.transactionCreated).toBeCalled();
    expect(props.nextStep).toBeCalled();
  });
});
