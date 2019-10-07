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
      loadData: jest.fn(),
    },
  };
  it('renders a page with header', () => {
    const wrapper = mount(<Blocks {...props} />);
    expect(wrapper.find('h2')).toHaveText('All blocks');
  });

  it('renders table with blocks', () => {
    const wrapper = mount(<Blocks {...props} />);
    expect(wrapper.find('.block-id')).toHaveLength(0);
    wrapper.setProps({
      blocks: {
        ...props.blocks,
        isLoading: false,
        data: blocks,
      },
    });
    expect(wrapper.find('.block-id')).toHaveLength(blocks.length);
  });

  it('allows to load more blocks', () => {
    const wrapper = mount(<Blocks {...props} />);
    wrapper.find('button.load-more').simulate('click');
    expect(props.blocks.loadData).toHaveBeenCalledWith(
      { offset: props.blocks.data.length }, expect.any(Object),
    );
  });

  it('shows error if ', () => {
    const error = 'Loading failed';
    const wrapper = mount(<Blocks {...props} />);
    wrapper.setProps({
      blocks: {
        ...props.blocks,
        isLoading: false,
        error,
      },
    });
    expect(wrapper).toIncludeText(error);
  });
});
