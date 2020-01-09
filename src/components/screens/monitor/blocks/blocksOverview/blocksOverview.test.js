import React from 'react';
import { mount } from 'enzyme';
import BlocksOverview from './blocksOverview';
import blocks from '../../../../../../test/constants/blocks';

describe('Blocks Overview', () => {
  const props = {
    t: (key, values = {}) => key.replace('{{num}}', values.num),
    blocks: {
      isLoading: true,
      data: blocks,
      loadData: jest.fn(),
      clearData: jest.fn(),
      urlSearchParams: {},
    },
  };

  it('calls loadData when changing tab', () => {
    const wrapper = mount(<BlocksOverview {...props} />);
    expect(wrapper.find('.box-tabs .tab').at(0)).toIncludeText('Last 10 blocks');
    expect(wrapper.find('.box-tabs .tab').at(1)).toIncludeText('Last 50 blocks');
    expect(wrapper.find('.box-tabs .tab').at(2)).toIncludeText('Last 100 blocks');
    wrapper.find('.box-tabs ul li').at(1).simulate('click');
    expect(props.blocks.loadData).toBeCalledWith({ limit: '50' });
    wrapper.find('.box-tabs ul li').at(2).simulate('click');
    expect(props.blocks.loadData).toBeCalledWith({ limit: '100' });
    wrapper.find('.box-tabs ul li').at(0).simulate('click');
    expect(props.blocks.loadData).toBeCalledWith({ limit: '10' });
  });
});
