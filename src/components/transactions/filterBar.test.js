import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { spy } from 'sinon';
import FilterBar from './filterBar';

describe('FilterBar', () => {
  it('shows 3 filters', () => {
    const props = {
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

    const wrapper = shallow(<FilterBar {...props} />);
    expect(wrapper.find('.filter').length).to.have.equal(3);
  });
});
