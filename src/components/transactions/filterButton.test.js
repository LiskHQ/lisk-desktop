import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { spy } from 'sinon';
import Input from 'react-toolbox/lib/input';
import Button from 'react-toolbox/lib/button';
import FilterButton from './filterButton';

describe('FilterButton', () => {
  it('should call saveFilters with expected Output', () => {
    const props = {
      saveFilters: spy(),
      t: spy(),
    };
    const expectedValue = {
      dateFrom: '',
      dateTo: '',
      amountFrom: '',
      amountTo: '',
      message: 'test',
    };
    const wrapper = shallow(<FilterButton {...props} />);
    wrapper.find(Input).props().onChange('test');
    wrapper.find(Button).props().onClick();
    expect(props.saveFilters).to.be.calledWith(expectedValue);
  });
});
