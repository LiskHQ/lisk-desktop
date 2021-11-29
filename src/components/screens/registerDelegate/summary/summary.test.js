import React from 'react';
import { mount } from 'enzyme';
import { mountWithRouterAndStore } from '@utils/testHelpers';
import Summary from './summary';
import accounts from '../../../../../test/constants/accounts';

describe('Delegate Registration Summary', () => {
  const props = {
    account: accounts.genesis,
    username: 'mydelegate',
    prevStep: jest.fn(),
    nextStep: jest.fn(),
    t: key => key,
    transactionInfo: {
      fee: 1900000000,
    },
  };

  afterEach(() => {
    props.nextStep.mockRestore();
  });

  it('renders properly Symmary component', () => {
    const wrapper = mount(<Summary {...props} />);
    expect(wrapper).toContainMatchingElement('.username-label');
    expect(wrapper).toContainMatchingElement('.username');
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
    const wrapper = mountWithRouterAndStore(
      Summary,
      props,
      {},
      {
        transactions: {
          txSignatureError: null,
          signedTransaction: { id: 1 },
        },
      },
    );
    expect(props.nextStep).not.toBeCalled();
    wrapper.find('button.confirm-button').simulate('click');
    expect(props.nextStep).toBeCalledWith({ transactionInfo: props.transactionInfo });
  });

  it('submit user data when click in confirm button but fails', () => {
    const error = {};
    const wrapper = mountWithRouterAndStore(
      Summary,
      props,
      {},
      {
        transactions: {
          txSignatureError: error,
          signedTransaction: { id: 1 },
        },
      },
    );
    wrapper.find('button.confirm-button').simulate('click');
    expect(props.nextStep).toBeCalledWith({ error });
  });
});
