import React from 'react';
import { mount } from 'enzyme';
import { account } from '@constants';
import Warning from './warning';

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

  it('Should render empty component', () => {
    expect(wrapper).toBeEmptyRender();

    wrapper.setProps({
      warningTime: Date.now(),
    });
    wrapper.update();
    expect(wrapper).not.toBeEmptyRender();
  });
});
