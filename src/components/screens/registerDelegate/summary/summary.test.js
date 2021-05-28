import React from 'react';
import { mount } from 'enzyme';
import * as transactionsApi from '@api/transaction';
import Summary from './summary';
import accounts from '../../../../../test/constants/accounts';
import flushPromises from '../../../../../test/unit-test-utils/flushPromises';

describe('Delegate Registration Summary', () => {
  const props = {
    account: accounts.genesis,
    nickname: 'mydelegate',
    prevStep: jest.fn(),
    fee: 10,
    nextStep: jest.fn(),
    t: key => key,
    transactionInfo: {},
  };

  const response = {
    account: props.account,
    username: props.nickname,
    passphrase: props.passphrase,
    recipientId: '123123L',
    amount: 0,
    nonce: '123',
  };

  afterEach(() => {
    props.nextStep.mockRestore();
  });

  it('renders properly Symmary component', () => {
    const wrapper = mount(<Summary {...props} />);
    expect(wrapper).toContainMatchingElement('.nickname-label');
    expect(wrapper).toContainMatchingElement('.nickname');
    expect(wrapper).toContainMatchingElement('.address');
    expect(wrapper).toContainMatchingElement('button.confirm-button');
    expect(wrapper).toContainMatchingElement('button.cancel-button');
  });

  it('go to prev page when click Go Back button', () => {
    const wrapper = mount(<Summary {...props} />);
    expect(props.prevStep).not.toBeCalled();
    wrapper.find('button.cancel-button').simulate('click');
    expect(props.prevStep).toBeCalled();
  });

  it('submit user data when click in confirm button', () => {
    const wrapper = mount(<Summary {...props} />);
    expect(props.nextStep).not.toBeCalled();
    wrapper.find('button.confirm-button').simulate('click');
    expect(props.nextStep).toBeCalledWith({ transactionInfo: props.transactionInfo });
  });

  it('submit user data when click in confirm button but fails', () => {
    const error = {};
    const wrapper = mount(<Summary {...props} error={error} />);
    wrapper.find('button.confirm-button').simulate('click');
    expect(props.nextStep).toBeCalledWith({ error });
  });
});
