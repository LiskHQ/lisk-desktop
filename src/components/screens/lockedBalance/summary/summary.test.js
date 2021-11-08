import React from 'react';
import { mount } from 'enzyme';
import { mountWithRouterAndStore } from '@utils/testHelpers';
import Summary from './index';
import accounts from '../../../../../test/constants/accounts';

describe('Delegate Registration Summary', () => {
  const props = {
    transactionInfo: {
      asset: {
        unlockObjects: [{ amount: '2500000000000' }],
      },
    },
    account: accounts.genesis,
    fee: 10,
    nextStep: jest.fn(),
    prevStep: jest.fn(),
    t: key => key,
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

  it('submit user data when click in confirm button', () => {
    const { wrapper } = mountWithRouterAndStore(
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
    expect(props.nextStep).toBeCalled();
  });

  it('submit user data when click in confirm button but fails', () => {
    const error = {};
    const { wrapper } = mountWithRouterAndStore(
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
