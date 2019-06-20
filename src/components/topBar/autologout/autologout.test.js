import React from 'react';
import { mount } from 'enzyme';
import account from '../../../constants/account';
import Autologout from './autologout';

describe('Autlologout component', () => {
  const props = {
    account: {
      expireTime: Date.now() + account.lockDuration,
    },
    onCountdownComplete: jest.fn(),
    closeDialog: jest.fn(),
    history: {},
    resetTimer: jest.fn(),
    setActiveDialog: jest.fn(),
    t: v => v,
  };
  let wrapper;

  beforeEach(() => {
    wrapper = mount(<Autologout {...props} />);
  });

  it('Should render empty component', () => {
    expect(wrapper.html()).toBeNull();
    wrapper.setProps({
      account: {
        expireTime: Date.now(),
      },
    });
    wrapper.update();
    expect(props.onCountdownComplete).toBeCalled();
  });
});
