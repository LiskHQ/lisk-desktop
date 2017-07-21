import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import FormattedNumber from '../formattedNumber/index';


describe('FormattedNumber', () => {
  it('should normalize "12932689.645" as "12,932,689.645"', () => {
    const inputValue = '12932689.645';
    const expectedValue = '12,932,689.645';
    const wrapper = shallow(<FormattedNumber val={inputValue} />);
    expect(wrapper.find('span').text()).to.be.equal(expectedValue);
  });

  it('should normalize "2500" as "2,500"', () => {
    const inputValue = '2500';
    const expectedValue = '2,500';
    const wrapper = shallow(<FormattedNumber val={inputValue} />);
    expect(wrapper.find('span').text()).to.be.equal(expectedValue);
  });

  it('should normalize "-78945" as "-78,945"', () => {
    const inputValue = '78945';
    const expectedValue = '78,945';
    const wrapper = shallow(<FormattedNumber val={inputValue} />);
    expect(wrapper.find('span').text()).to.be.equal(expectedValue);
  });

  it('should normalize "0" as "0"', () => {
    const inputValue = '0';
    const expectedValue = '0';
    const wrapper = shallow(<FormattedNumber val={inputValue} />);
    expect(wrapper.find('span').text()).to.be.equal(expectedValue);
  });

  it('should normalize "500.12345678" as "500.12345678"', () => {
    const inputValue = '500.12345678';
    const expectedValue = '500.12345678';
    const wrapper = shallow(<FormattedNumber val={inputValue} />);
    expect(wrapper.find('span').text()).to.be.equal(expectedValue);
  });
});
