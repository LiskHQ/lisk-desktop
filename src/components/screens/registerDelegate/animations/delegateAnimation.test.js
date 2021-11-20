import React from 'react';
import { mount } from 'enzyme';
import lottie from 'lottie-web';
import DelegateAnimation from './delegateAnimation';

jest.mock('lottie-web');

describe('Delegate animation component', () => {
  const props = {
    className: 'test-className',
    status: 'pending',
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
    wrapper = mount(<DelegateAnimation {...props} />);
  });

  it('Should render delegate animation component without errors', () => {
    expect(wrapper).toHaveClassName(props.className);
    expect(wrapper).toContainMatchingElement('Animation');
  });

  it('Should pass correct animation name to Animation component', () => {
    const animations = {
      pending: 'delegateCreated',
      success: 'delegateConfirmed',
      error: 'delegateDeclined',
    };

    Object.keys(animations).forEach((status) => {
      wrapper.setProps({ status });
      expect(wrapper.find('Animation')).toHaveProp('name', animations[status]);
    });
  });

  it('Should load next animation after correct event', () => {
    const animations = {
      created: 'delegateCreated',
      pending: 'delegatePending',
    };
    wrapper.setProps({ status: 'pending' });
    expect(wrapper.find('Animation')).toHaveProp('name', animations.created);
    eventsMap.complete();
    wrapper.update();
    expect(wrapper.find('Animation')).toHaveProp('name', animations.pending);
    wrapper.setProps({ status: 'success' });
    wrapper.unmount();
  });
});
