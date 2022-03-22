import React from 'react';
import { mount } from 'enzyme';
import { mountWithRouterAndStore } from '@common/utilities/testHelpers';
import Summary from './summary';
import accounts from '../../../../../test/constants/accounts';

describe('Delegate Registration Summary', () => {
  const props = {
    delegateRegistered: jest.fn(),
    rawTransaction: {
      username: 'mydelegate',
      fee: { value: 1900000000 },
    },
    account: accounts.genesis,
    prevStep: jest.fn(),
    nextStep: jest.fn(),
    t: key => key,
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
      Summary, props, {}, {},
    );
    expect(props.nextStep).not.toBeCalled();
    wrapper.find('button.confirm-button').simulate('click');
    expect(props.nextStep).toBeCalledWith({
      actionFunction: props.delegateRegistered,
      rawTransaction: props.rawTransaction,
    });
  });
});
