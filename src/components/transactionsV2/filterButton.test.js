import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { spy } from 'sinon';
import Input from 'react-toolbox/lib/input';
import { PrimaryButtonV2 } from '../toolbox/buttons/button';
import FilterButton from './filterButton';
import keyCodes from './../../constants/keyCodes';

describe('FilterButton', () => {
  it('should call saveFilters with expected Output', () => {
    const props = {
      saveFilters: spy(),
      t: spy(),
      customFilters: {},
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
    wrapper.find(PrimaryButtonV2).props().onClick();
    expect(props.saveFilters).to.be.calledWith(expectedValue);
  });

  it('should toggle Filters dropdown', () => {
    const props = {
      t: spy(),
      customFilters: {},
    };

    const wrapper = shallow(<FilterButton {...props} />);
    expect(wrapper.state('showFilters')).to.be.been.equal(false);
    wrapper.find('.filterTransactions').simulate('click');
    expect(wrapper.state('showFilters')).to.be.been.equal(true);
    wrapper.find('.filterTransactions').simulate('click');
    expect(wrapper.state('showFilters')).to.be.been.equal(false);
  });

  it('should call saveFilters with expected Output', () => {
    const props = {
      saveFilters: spy(),
      t: spy(),
      customFilters: {},
    };
    const expectedValue = {
      dateFrom: '',
      dateTo: '',
      amountFrom: '',
      amountTo: '',
      message: '',
    };
    const wrapper = shallow(<FilterButton {...props} />);
    wrapper.find(Input).props().onKeyDown({ keyCode: keyCodes.enter });
    expect(props.saveFilters).to.be.calledWith(expectedValue);
  });
});
