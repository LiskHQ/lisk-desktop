import { act } from 'react-dom/test-utils';
import React from 'react';
import { mount } from 'enzyme';
import io from 'socket.io-client';
import { subscribeConnections } from '@api/ws';
import LoadLatestButton from '.';

jest.mock('socket.io-client');

const on = (ev, callback) => {
  setTimeout(() => {
    callback(ev);
  }, 1);
};
const close = jest.fn();
io.mockImplementation(() => ({ on, close }));

describe('LoadLatestButton', () => {
  const props = {
    onClick: jest.fn(),
    event: 'test.event',
    children: 'Test load button',
  };
  const render = () => {
    const wrapper = mount(<LoadLatestButton {...props} />);
    return wrapper;
  };

  it('renders empty by default', () => {
    const wrapper = render();
    expect(wrapper).toBeEmptyRender();
  });

  it('shows button on websocket event and hides the button on click', () => {
    jest.useFakeTimers();

    const wrapper = render();
    expect(wrapper).toBeEmptyRender();
    act(() => {
      jest.runOnlyPendingTimers();
    });
    wrapper.update();
    expect(wrapper).toContainExactlyOneMatchingElement('button');
    expect(wrapper).toHaveText(props.children);

    wrapper.find('button').simulate('click');
    expect(props.onClick).toHaveBeenCalledWith();
    act(() => {
      jest.runOnlyPendingTimers();
    });
    expect(wrapper).toBeEmptyRender();
    expect(subscribeConnections[props.event]).toBeDefined();
  });

  it('clears the timeout before unmounting', () => {
    jest.useFakeTimers();
    const wrapper = render();
    expect(subscribeConnections[props.event]).toBeDefined();
    expect(close).toHaveBeenCalledTimes(0);

    wrapper.unmount();
    expect(clearTimeout).toHaveBeenCalledTimes(1);
    expect(close).toHaveBeenCalledTimes(1);
    expect(subscribeConnections[props.event]).not.toBeDefined();
  });
});
