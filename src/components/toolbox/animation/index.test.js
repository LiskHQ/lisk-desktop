import React from 'react';
import lottie from 'lottie-web';
import { mount } from 'enzyme';
import Animation from './';

jest.mock('lottie-web');

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
      segmentStart: jest.fn(),
    },
  };

  let eventsMap;
  let wrapper;

  beforeEach(() => {
    eventsMap = {};
    const anim = {
      destroy: jest.fn(),
      addEventListener: jest.fn((event, cb) => {
        eventsMap[event] = cb;
      }),
      removeEventListener: jest.fn((event) => {
        delete eventsMap[event];
      }),
    };

    lottie.loadAnimation = jest.fn(() => anim);
    wrapper = mount(<Animation {...props} />);
  });

  it('Should render animation container with className', () => {
    wrapper.setProps({ name: 'delegateCreated' });
    expect(wrapper).toHaveClassName(props.className);
    wrapper.unmount();
  });

  it('Should render animation container without className', () => {
    wrapper.setProps({
      name: 'delegatePending',
      loop: true,
      className: '',
    });
    wrapper.update();
    expect(wrapper).not.toHaveClassName(props.className);
    wrapper.unmount();
  });

  describe('Event binding to animation', () => {
    Object.keys(props.events).forEach((event) => {
      it(`Should bind ${event} to animation and trigger it`, () => {
        eventsMap[event]();
        expect(props.events[event]).toBeCalled();
      });
    });
  });
});
