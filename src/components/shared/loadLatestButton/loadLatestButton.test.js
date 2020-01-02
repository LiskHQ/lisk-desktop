import React from 'react';
import { mount } from 'enzyme';
import LoadLatestButton from '.';

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
});
