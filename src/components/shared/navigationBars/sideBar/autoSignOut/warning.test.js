import React from 'react';
import { mount } from 'enzyme';
import { timerReset } from '@actions';
import { account } from '@constants';
import Warning from './warning';

jest.mock('react-toastify', () => ({
  toast: (component) => (component),
}));

jest.mock('@actions', () => ({
  timerReset: jest.fn(),
}));

describe('Warning', () => {
  const date = Date.now();
  const expireTime = date + account.lockDuration;
  const warningTime = date + account.warnLockDuration;

  const props = {
    warningTime,
    expireTime,
    t: v => v,
  };
  let wrapper;

  beforeEach(() => {
    wrapper = mount(<Warning {...props} />);
  });

  it('Should render empty component and call  timeReset', () => {
    expect(wrapper).toBeEmptyRender();

    wrapper.setProps({
      warningTime: Date.now(),
    });
    wrapper.update();
    expect(wrapper).not.toBeEmptyRender();
    wrapper.find('.reset-time-button').simulate('click');
    expect(timerReset).toHaveBeenCalled();
  });
});
