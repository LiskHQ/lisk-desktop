import { act } from 'react-dom/test-utils';
import React from 'react';
import { mount } from 'enzyme';
import LoadLatestButton from './loadLatestButton';

const close = jest.fn();

describe('LoadLatestButton', () => {
  const props = {
    onClick: jest.fn(),
    entity: 'block',
    children: 'Test load button',
    latestBlocks: [],
  };

  it('renders empty by default', () => {
    const wrapper = mount(<LoadLatestButton {...props} />);
    expect(wrapper).toBeEmptyRender();
  });

  it('shows button when there is a new block', () => {
    const wrapper = mount(<LoadLatestButton {...props} />);
    expect(wrapper).toBeEmptyRender();
    wrapper.setProps({
      latestBlocks: [
        { height: 11111112 },
      ],
    });
    act(() => {
      wrapper.update();
    });
    expect(wrapper).toContainExactlyOneMatchingElement('button');
    expect(wrapper).toHaveText(props.children);

    wrapper.find('button').at(0).simulate('click');
    expect(props.onClick).toHaveBeenCalledWith();
    act(() => {
      wrapper.update();
    });
    expect(wrapper).toBeEmptyRender();
  });
});
