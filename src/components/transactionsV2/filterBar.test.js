import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { spy } from 'sinon';
import FilterBar from './filterBar';

describe('FilterBar', () => {
  let wrapper;
  const props = {
    clearFilter: spy(),
    clearAllFilters: spy(),
    saveFilters: spy(),
    t: spy(),
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

  it('shows 3 filters', () => {
    expect(wrapper.find('.filter').length).to.have.equal(3);
  });

  it('call clearFilter on filter click', () => {
    wrapper.find('.clearFilter').at(0).simulate('click');
    expect(props.clearFilter).to.have.been.calledWith('dateTo');
  });

  it('call clearFilter on filter click', () => {
    wrapper.find('.clearAll').at(1).simulate('click');
    expect(props.clearAllFilters).to.have.been.calledWith();
  });
});
