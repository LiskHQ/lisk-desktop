import React from 'react';
import { mount } from 'enzyme';
import Status from './status';

describe('Delegate Registration Status', () => {
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
    delegate: {
      registerStep: 'register-success',
    },
    userInfo: {
      nickname: 'mydelegate',
    },
    prevState: {},
    nextStep: jest.fn(),
    prevStep: jest.fn(),
    goBackToDelegates: jest.fn(),
    submitDelegateRegistration: jest.fn(),
    t: key => key,
  };

  beforeEach(() => {
    wrapper = mount(<Status {...props} />);
  });

  it('renders properly Symmary component', () => {
    expect(wrapper).toContainMatchingElement('.status-container');
    expect(wrapper).toContainMatchingElement('.result-box-header');
    expect(wrapper).toContainMatchingElement('.body-message');
    expect(wrapper).toContainMatchingElement('button.go-back-to-delegates');
    expect(wrapper).not.toContainMatchingElement('button.on-retry');
    wrapper.find('button.go-back-to-delegates').simulate('click');
    expect(props.goBackToDelegates).toBeCalled();
  });
});
