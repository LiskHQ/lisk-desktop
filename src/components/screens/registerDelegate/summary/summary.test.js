import React from 'react';
import { mount } from 'enzyme';
import * as transactionsApi from '@api/transaction';
import Summary from './summary';
import accounts from '../../../../../test/constants/accounts';
import flushPromises from '../../../../../test/unit-test-utils/flushPromises';

describe('Delegate Registration Summary', () => {
  jest.mock('@api/transaction', () => ({
    create: jest.fn(),
  }));

  const network = {
    networks: {
      LSK: { networkIdentifier: 'sample_identifier' },
    },
  };

  const props = {
    account: accounts.genesis,
    fee: 10,
    prevState: {},
    nickname: 'mydelegate',
    nextStep: jest.fn(),
    prevStep: jest.fn(),
    t: key => key,
    network,
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
    expect(wrapper).toContainMatchingElement('.summary-container');
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

  it.skip('submit user data when click in confirm button', async () => {
    transactionsApi.create = jest.fn().mockImplementation(() => Promise.resolve(response));
    const wrapper = mount(<Summary {...props} />);
    expect(props.nextStep).not.toBeCalled();
    wrapper.find('button.confirm-button').simulate('click');
    await flushPromises();
    expect(transactionsApi.create).toHaveBeenCalled();
    expect(props.nextStep).toBeCalledWith({ transactionInfo: response });
  });

  it.skip('submit user data when click in confirm button but fails', async () => {
    transactionsApi.create = jest.fn().mockImplementation(() => Promise.reject(new Error('Some error')));
    const wrapper = mount(<Summary {...props} />);
    wrapper.find('button.confirm-button').simulate('click');

    await flushPromises();
    expect(props.nextStep).not.toBeCalled();
  });
});
