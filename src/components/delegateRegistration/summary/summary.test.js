import React from 'react';
import { mount } from 'enzyme';
import Summary from './summary';

describe('Delegate Registration Summary', () => {
  let wrapper;

  const props = {
    account: {
      info: {
        LSK: {
          address: '123456789L',
          balance: 11000,
        },
      },
      isDelegate: false,
    },
    prevState: {},
    nickname: 'mydelegate',
    nextStep: jest.fn(),
    prevStep: jest.fn(),
    submitDelegateRegistration: jest.fn(),
    t: key => key,
  };

  beforeEach(() => {
    wrapper = mount(<Summary {...props} />);
  });

  it('renders properly Symmary component', () => {
    expect(wrapper).toContainMatchingElement('.summary-container');
    expect(wrapper).toContainMatchingElement('.nickname-label');
    expect(wrapper).toContainMatchingElement('.nickname');
    expect(wrapper).toContainMatchingElement('.address');
    expect(wrapper).toContainMatchingElement('button.confirm-button');
    expect(wrapper).toContainMatchingElement('button.cancel-button');
  });

  it('go to prev page when click Go Back button', () => {
    expect(props.prevStep).not.toBeCalled();
    wrapper.find('button.cancel-button').simulate('click');
    expect(props.prevStep).toBeCalled();
  });

  it('submit user data when click in confirm button', () => {
    expect(props.nextStep).not.toBeCalled();
    expect(props.submitDelegateRegistration).not.toBeCalled();
    wrapper.find('button.confirm-button').simulate('click');
    expect(props.nextStep).toBeCalled();
    expect(props.submitDelegateRegistration).toBeCalled();
  });
});
