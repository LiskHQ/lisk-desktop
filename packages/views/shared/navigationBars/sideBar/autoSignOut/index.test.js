import React from 'react';
import { mount } from 'enzyme';
import account from '@wallet/configuration/constants';
import AutoSignOut from './index';

describe('AutoSignOut', () => {
  const expireTime = Date.now() + account.lockDuration;

  const props = {
    expireTime,
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
      expireTime: Date.now(),
    });
    wrapper.update();

    expect(props.onCountdownComplete).toBeCalled();
  });
});
