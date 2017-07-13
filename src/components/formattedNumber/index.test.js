import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import FormattedNumber from '../formattedNumber/index';

describe('<FormattedNumber />', () => {
  const normalizeNumber = 100000000;
  it('expect "12932689.645" to be equal "12,932,689.645"', () => {
    const inputValue = '12932689.645' * normalizeNumber;
    const expectedValue = '12,932,689.645';
    const wrapper = shallow(<FormattedNumber val={inputValue} />);
    expect(wrapper.find('span').text()).to.be.equal(expectedValue);
  });

  it('expect "2500" to be equal "2,500"', () => {
    const inputValue = '2500' * normalizeNumber;
    const expectedValue = '2,500';
    const wrapper = shallow(<FormattedNumber val={inputValue} />);
    expect(wrapper.find('span').text()).to.be.equal(expectedValue);
  });

  it('expect "-78945" to be equal "-78,945"', () => {
    const inputValue = '78945' * normalizeNumber;
    const expectedValue = '78,945';
    const wrapper = shallow(<FormattedNumber val={inputValue} />);
    expect(wrapper.find('span').text()).to.be.equal(expectedValue);
  });

  it('expect "0" to be equal "0"', () => {
    const inputValue = '0';
    const expectedValue = '0';
    const wrapper = shallow(<FormattedNumber val={inputValue} />);
    expect(wrapper.find('span').text()).to.be.equal(expectedValue);
  });

  it('expect "500.12345678" to be equal "500.12345678"', () => {
    const inputValue = '500.12345678' * normalizeNumber;
    const expectedValue = '500.12345678';
    const wrapper = shallow(<FormattedNumber val={inputValue} />);
    expect(wrapper.find('span').text()).to.be.equal(expectedValue);
  });
});
