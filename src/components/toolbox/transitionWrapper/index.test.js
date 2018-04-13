import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { useFakeTimers } from 'sinon';
import TransitionWrapper from './index';

describe('TransitionWrapper', () => {
  let wrapper;
  let clock;
  const step = 'any-step-name';

  beforeEach(() => {
    clock = useFakeTimers({
      toFake: ['setTimeout', 'clearTimeout', 'Date'],
    });
    wrapper = mount(<TransitionWrapper animationDuration={200} current={step} step='target-step-name'>
      <h1>Child</h1>
    </TransitionWrapper>);
  });

  afterEach(() => {
    clock.restore();
  });

  it('should render the child initially with animation config', () => {
    expect(wrapper.find('h1').length).to.equal(1);
    const className = wrapper.find('h1').props().className;
    expect(className).to.include('willTransition');
  });

  it('should show the element after state changed in favour of current child', () => {
    let className = wrapper.find('h1').props().className;
    expect(className).to.not.include('slideIn');

    wrapper.setProps({ current: 'target-step-name' });
    clock.tick(501);
    wrapper.update();

    className = wrapper.find('h1').props().className;
    expect(className).to.include('slideIn');
  });

  it('should hide the element after state changed against current child', () => {
    wrapper.setProps({ current: 'target-step-name' });
    clock.tick(501);
    wrapper.update();

    let className = wrapper.find('h1').props().className;
    expect(className).to.include('slideIn');

    wrapper.setProps({ current: 'any-step-name' });
    clock.tick(501);
    wrapper.update();

    className = wrapper.find('h1').props().className;
    expect(className).to.not.include('slideIn');
  });

  it('should allow to set animation name', () => {
    const props = {
      current: 'target-step-name',
      step: 'target-step-name',
      animationName: 'fade',
    };
    const customizedWrapper = mount(<TransitionWrapper {...props}>
      <h1>Child</h1>
    </TransitionWrapper>);

    clock.tick(501);
    customizedWrapper.update();

    const className = customizedWrapper.find('h1').props().className;
    expect(className).to.include('transitionWrapper__fadeIn');
    clock.restore();
  });
});
