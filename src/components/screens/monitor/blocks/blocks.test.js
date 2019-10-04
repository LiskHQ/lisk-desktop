import React from 'react';
import { mount } from 'enzyme';
import Blocks from './blocks';
import blocks from '../../../../../test/constants/blocks';

describe('Blocks page', () => {
  let props;

  beforeEach(() => {
    props = {
      t: key => key,
      blocks: {
        isLoading: true,
        data: [],
        loadData: jest.fn(),
        clearData: jest.fn(),
        urlSearchParams: {},
      },
    };
  });

  it('renders a page with header', () => {
    const wrapper = mount(<Blocks {...props} />);
    expect(wrapper.find('h1')).toHaveText('All blocks');
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
    const wrapper = mount(<Blocks {...{
      ...props,
      blocks: {
        ...props.blocks,
        isLoading: false,
        data: blocks,
      },
    }}
    />);
    wrapper.find('button.load-more').simulate('click');
    expect(props.blocks.loadData).toHaveBeenNthCalledWith(1,
      { offset: blocks.length }, expect.any(Object));
  });

  it('shows error if API failed', () => {
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

  it('allows to filter blocks by height and clear the filter', () => {
    const height = '1234';
    const wrapper = mount(<Blocks {...props} />);
    wrapper.find('button.filter').simulate('click');
    wrapper.find('input.height').simulate('change', { target: { value: height } });
    wrapper.find('form.filter-container').simulate('submit');
    expect(props.blocks.loadData).toHaveBeenCalledWith({ height });
    wrapper.find('span.clear-filter').simulate('click');
    expect(props.blocks.loadData).toHaveBeenCalledWith({ });
  });
});
