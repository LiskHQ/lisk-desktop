import { act } from 'react-dom/test-utils';
import React from 'react';
import { mount } from 'enzyme';
import LoadLatestButton from '.';
import liskService from '../../../utils/api/lsk/liskService';

jest.mock('../../../utils/api/lsk/liskService');

describe('LoadLatestButton', () => {
  let onSocketEvent;
  const props = {
    onClick: jest.fn(),
    event: 'test.event',
    children: 'Test load button',
  };
  const render = () => {
    liskService.listenToBlockchainEvents.mockImplementation(({ callback }) => {
      onSocketEvent = callback;
    });
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

    act(() => { onSocketEvent(); });
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
