import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import FormattedNumber from '../formattedNumber/index';

describe('<FormattedNumber />', () => {
  it('expect "12932689.645" to be equal "12,932,689.645"', () => {
    const inputValue = '12932689.645';
    const expectedValue = '12,932,689.645';
    const wrapper = shallow(<FormattedNumber val={inputValue} />);
    expect(wrapper.find('span').text()).to.be.equal(expectedValue);
  });

  it('expect "2500" to be equal "2,500"', () => {
    const inputValue = '2500';
    const expectedValue = '2,500';
    const wrapper = shallow(<FormattedNumber val={inputValue} />);
    expect(wrapper.find('span').text()).to.be.equal(expectedValue);
  });
});
