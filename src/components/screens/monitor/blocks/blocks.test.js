import React from 'react';
import { mount } from 'enzyme';
import Blocks from '.';

describe('Blocks page', () => {
  it('renders a page with header', () => {
    const wrapper = mount(<Blocks />);
    expect(wrapper.find('h1')).toHaveText('All blocks');
  });
});
