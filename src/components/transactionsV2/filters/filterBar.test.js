import React from 'react';
import { shallow } from 'enzyme';
import FilterBar from './filterBar';

describe('FilterBar', () => {
  let wrapper;
  const props = {
    clearFilter: jest.fn(),
    clearAllFilters: jest.fn(),
    saveFilters: jest.fn(),
    t: v => v,
    customFilters: {
      dateFrom: '',
      dateTo: '12-12-12',
      amountFrom: '',
      amountTo: '',
      message: 'test',
    },
  };

  beforeEach(() => {
    wrapper = shallow(<FilterBar {...props} />);
  });

  it('Shows 2 filters and clearAll', () => {
    expect(wrapper).toContainMatchingElements(2, '.filter');
    expect(wrapper).toContainMatchingElement('.clearAllButton');
  });

  it('Call clearFilter on clearFilter click', () => {
    wrapper.find('.clearBtn').first().simulate('click');
    expect(props.clearFilter).toBeCalledWith('dateTo');
  });

  it('Call clearAllFilters on clearAll click', () => {
    wrapper.find('.clearAllButton').simulate('click');
    expect(props.clearAllFilters).toBeCalled();
  });
});
