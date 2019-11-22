import React from 'react';
import { mount } from 'enzyme';
import BlocksOverview from './blocksOverview';
import blocks from '../../../../../../test/constants/blocks';

describe('Blocks Overview', () => {
  const props = {
    t: key => key,
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
    expect(wrapper.find('box-header')).toIncludeText('10');
    expect(wrapper.find('box-header')).toIncludeText('50');
  });
});
