import React from 'react';
import { mount } from 'enzyme';
import BlockchainApplicationStatistics from './index';

describe('BlockchainApplicationStatistics', () => {
  const props = {
    statistics: {
      data: {
        registered: 101,
        active: 53,
        terminated: 9,
        totalSupplyLSK: '5000000',
        stakedLSK: '3000000',
      },
    },
  };

  it('should properly', () => {
    const wrapper = mount(<BlockchainApplicationStatistics {...props} />);

    expect(wrapper.find('.total-supply-token').at(0)).toHaveText('5,000,000 LSK');
    expect(wrapper.find('.stacked-token').at(0)).toHaveText('3,000,000 LSK');
  });
});
