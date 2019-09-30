import React from 'react';
import { mount } from 'enzyme';
import Blocks from './blocks';
import blocks from '../../../../../test/constants/blocks';

describe('Blocks page', () => {
  const props = {
    t: key => key,
    blocks: {
      isLoading: true,
      data: [],
    },
  };
  it('renders a page with header', () => {
    const wrapper = mount(<Blocks {...props} />);
    expect(wrapper.find('h1')).toHaveText('All blocks');
  });

  it('renders table with blocks', () => {
    const wrapper = mount(<Blocks {...props} />);
    expect(wrapper.find('.blockId')).toHaveLength(0);
    wrapper.setProps({
      blocks: {
        isLoading: false,
        data: blocks,
      },
    });
    expect(wrapper.find('.blockId')).toHaveLength(blocks.length);
  });
});
