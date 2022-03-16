import React from 'react';
import { mount } from 'enzyme';
import Summary from './summary';
import accounts from '../../../../../test/constants/accounts';

describe('Locked balance Summary', () => {
  const props = {
    currentBlockHeight: 10000000,
    balanceUnlocked: jest.fn(),
    rawTransaction: {
      selectedFee: '2500000000000',
    },
    nextStep: jest.fn(),
    prevStep: jest.fn(),
    t: key => key,
    account: accounts.genesis,
  };

  afterEach(() => {
    props.nextStep.mockRestore();
  });

  it('renders properly Summary component', () => {
    const wrapper = mount(<Summary {...props} />);
    expect(wrapper).toContainMatchingElement('.address-label');
    expect(wrapper).toContainMatchingElement('.amount-label');
    expect(wrapper).toContainMatchingElement('button.confirm-button');
    expect(wrapper).toContainMatchingElement('button.cancel-button');
  });

  it('go to prev page when click Go Back button', () => {
    const wrapper = mount(<Summary {...props} />);
    expect(props.prevStep).not.toBeCalled();
    wrapper.find('button.cancel-button').simulate('click');
    expect(props.prevStep).toBeCalled();
  });

  it('submit transaction and action function when click in confirm button', () => {
    const wrapper = mount(<Summary {...props} />);
    expect(props.nextStep).not.toBeCalled();
    wrapper.find('button.confirm-button').simulate('click');
    expect(props.nextStep).toBeCalledWith({
      actionFunction: props.balanceUnlocked,
      rawTransaction: props.rawTransaction,
    });
  });
});
