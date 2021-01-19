import { act } from 'react-dom/test-utils';
import React from 'react';
import { mount } from 'enzyme';
import LoadLatestButton from '.';

jest.mock('../../../utils/api/ws', () => ({
  subscribe: (node, ev, update) => {
    setTimeout(() => {
      update(ev);
    }, 1);
    return { close: jest.fn() };
  },
}));

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
  });

  it('clears the timeout before unmounting', () => {
    jest.useFakeTimers();
    const wrapper = render();
    wrapper.unmount();
    expect(clearTimeout).toHaveBeenCalledTimes(1);
  });
});
