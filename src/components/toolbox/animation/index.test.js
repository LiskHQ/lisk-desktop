import React from 'react';
import { mount } from 'enzyme';
import Animation from './';

describe('Animation component', () => {
  const props = {
    name: 'delegateCreated',
    loop: false,
    autoplay: true,
    renderer: 'svg',
    className: 'test-classname',
    events: {
      complete: jest.fn(),
      loopComplete: jest.fn(),
      enterFrame: jest.fn(),
    },
  };

  it('Should render animation container with className', () => {
    const wrapper = mount(<Animation {...props} />);
    wrapper.setProps({ name: 'delegateCreated' });
    expect(wrapper).toHaveClassName(props.className);
    wrapper.unmount();
  });

  it('Should render animation container without className', () => {
    const wrapper = mount(<Animation {...props} />);
    wrapper.setProps({
      name: 'delegatePending',
      loop: true,
      className: '',
    });
    wrapper.update();
    expect(wrapper).not.toHaveClassName(props.className);
    wrapper.unmount();
  });
});
