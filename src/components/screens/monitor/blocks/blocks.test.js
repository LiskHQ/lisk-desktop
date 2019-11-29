import React from 'react';
import { mount } from 'enzyme';
import Blocks from './blocks';
import blocks from '../../../../../test/constants/blocks';

jest.mock('../../../../constants/monitor', () => ({ DEFAULT_LIMIT: 6 }));

describe('Blocks page', () => {
  let props;
  let blocksWithData;
  const sort = 'height:desc';
  const height = '1234';

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

    blocksWithData = {
      ...props.blocks,
      isLoading: false,
      data: blocks,
    };
  });

  it('renders a page with header', () => {
    const wrapper = mount(<Blocks {...props} />);
    expect(wrapper.find('.blocks-header-title')).toHaveText('All blocks');
  });

  it('renders table with blocks', () => {
    const wrapper = mount(<Blocks {...props} />);
    expect(wrapper.find('a.row')).toHaveLength(0);
    wrapper.setProps({ blocks: blocksWithData });
    expect(wrapper.find('a.row')).toHaveLength(blocks.length);
  });

  it('allows to load more blocks', () => {
    const wrapper = mount(<Blocks {...{ ...props, blocks: blocksWithData }} />);
    wrapper.find('button.load-more').simulate('click');
    expect(props.blocks.loadData).toHaveBeenCalledWith({ offset: blocks.length, sort });
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
    const wrapper = mount(<Blocks {...props} />);
    wrapper.find('button.filter').simulate('click');
    wrapper.find('input.height').simulate('change', { target: { value: height } });
    wrapper.find('form.filter-container').simulate('submit');
    expect(props.blocks.loadData).toHaveBeenCalledWith({ height, sort });
    wrapper.find('span.clear-filter').simulate('click');
    expect(props.blocks.loadData).toHaveBeenCalledWith({ sort });
  });

  it('allows to load more blocks when filtered', () => {
    const wrapper = mount(<Blocks {...{ ...props, blocks: blocksWithData }} />);

    wrapper.find('button.filter').simulate('click');
    wrapper.find('input.height').simulate('change', { target: { value: height } });
    wrapper.find('form.filter-container').simulate('submit');
    wrapper.find('button.load-more').simulate('click');

    expect(props.blocks.loadData).toHaveBeenCalledWith({ offset: blocks.length, height, sort });
  });

  it('allows to reverse sort by clicking height header', () => {
    const wrapper = mount(<Blocks {...{ ...props, blocks: blocksWithData }} />);
    wrapper.find('.sort-by.height').simulate('click');
    expect(props.blocks.loadData).toHaveBeenCalledWith({ sort: 'height:asc' });
    wrapper.find('.sort-by.height').simulate('click');
    expect(props.blocks.loadData).toHaveBeenCalledWith({ sort: 'height:desc' });
  });
});
