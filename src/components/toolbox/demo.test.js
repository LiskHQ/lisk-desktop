import React from 'react';
import { mount } from 'enzyme';
import ToolboxDemo from './demo';

describe('ToolboxDemo', () => {
  it('should render', () => {
    const wrapper = mount(<ToolboxDemo />);
    expect(wrapper).toHaveLength(1);
  });
});
