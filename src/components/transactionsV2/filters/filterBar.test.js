import React from 'react';
import { shallow } from 'enzyme';
import FilterBar from './filterBar';

describe('FilterBar', () => {
  let wrapper;
  const props = {
    clearFilter: jest.fn(),
    clearAllFilters: jest.fn(),
    t: v => v,
    customFilters: {
      dateFrom: '11.12.16',
      dateTo: '12.12.16',
      amountFrom: '0.6',
      amountTo: '1',
      message: 'test',
    },
  };

  beforeEach(() => {
    wrapper = shallow(<FilterBar {...props} />);
  });

  it('Shows 5 filters and clearAll', () => {
    expect(wrapper).toContainMatchingElements(5, '.filter');
    expect(wrapper).toContainMatchingElement('.clearAllButton');
  });

  it('Call clearFilter on clearFilter click', () => {
    wrapper.find('.clearBtn').first().simulate('click');
    expect(props.clearFilter).toBeCalledWith('dateFrom');
  });

  it('Call clearAllFilters on clearAll click', () => {
    wrapper.find('.clearAllButton').simulate('click');
    expect(props.clearAllFilters).toBeCalled();
  });
});
