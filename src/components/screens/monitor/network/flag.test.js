import React from 'react';
import { mount } from 'enzyme';
import Flag from './flag';

describe('Flag', () => {
  it('renders a flag for each existing code', () => {
    const wrapper = mount(<Flag code="PL" />);
    expect(wrapper.html().match(/PL/gm)).toHaveLength(1);
  });

  it('renders a hyphen if code not passed', () => {
    const wrapper = mount(<Flag />);
    expect(wrapper.html().match(/-/gm)).toHaveLength(1);
  });
});
