import React from 'react';
import { mount } from 'enzyme';
import FilterBar from './index';

describe('FilterBar', () => {
  let wrapper;
  const props = {
    clearFilter: jest.fn(),
    clearAllFilters: jest.fn(),
    t: (v) => v,
    filters: {
      dateFrom: '11.12.16',
      dateTo: '12.12.16',
      amountFrom: '0.6',
      amountTo: '1',
      message: 'test',
    },
  };

  beforeEach(() => {
    wrapper = mount(<FilterBar {...props} />);
  });

  it('Shows 5 filters and clearAll', () => {
    expect(wrapper).toContainMatchingElements(5, 'FilterButton');
    expect(wrapper).toContainMatchingElement('.clear-all-filters');
  });

  it('Call clearAllFilters on clearAll click', () => {
    wrapper.find('.clear-all-filters').at(0).simulate('click');
    expect(props.clearAllFilters).toBeCalled();
  });
});
