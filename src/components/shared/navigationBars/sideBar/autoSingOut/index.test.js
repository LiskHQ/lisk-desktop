import React from 'react';
import { mount } from 'enzyme';
import account from '../../../../../constants/account';
import AutoSignOut from './index';

describe('Autlologout component', () => {
  const props = {
    account: {
      expireTime: Date.now() + account.lockDuration,
    },
    onCountdownComplete: jest.fn(),
    history: {},
    resetTimer: jest.fn(),
    t: v => v,
  };
  let wrapper;

  beforeEach(() => {
    wrapper = mount(<AutoSignOut {...props} />);
  });

  it('Should render empty component', () => {
    expect(wrapper).toBeEmptyRender();
    wrapper.setProps({
      account: {
        expireTime: Date.now(),
      },
    });
    wrapper.update();
    expect(props.onCountdownComplete).toBeCalled();
  });
});
