import React from 'react';
import { mount } from 'enzyme';
import ToolboxDemo from './demo';

describe('ToolboxDemo', () => {
  it('should render', () => {
    const wrapper = mount(<ToolboxDemo />);
    expect(wrapper).toHaveLength(1);
  });

  it('Should render clickable tab', () => {
    const wrapper = mount(<ToolboxDemo />);
    wrapper.find('li[data-value="opt2"]').first().simulate('click');
  });
});
