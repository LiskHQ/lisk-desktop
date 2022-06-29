import React from 'react';
import { mount } from 'enzyme';
import BlockchainApplicationStatistics from './index';

describe('BlockchainApplicationStatistics', () => {
  const props = {
    apps: {
      data: [{ status: 'registered' }, { status: 'registered' }, { status: 'active' }, { status: 'terminated' }],
    },
    statistics: {
      data: {
        totalSupplyLSK: 5e13,
        stakedLSK: 3e13,
      },
    },
  };

  it('should properly', () => {
    const wrapper = mount(<BlockchainApplicationStatistics {...props} />);

    expect(wrapper.find('.total-supply-token').at(0)).toHaveText('500,000 LSK');
    expect(wrapper.find('.stacked-token').at(0)).toHaveText('300,000 LSK');
  });
});
