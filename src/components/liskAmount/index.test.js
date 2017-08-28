import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import LiskAmount from './';

describe('LiskAmount', () => {
  const normalizeNumber = 100000000;
  it('should normalize "12932689.645" as "12,932,689.645"', () => {
    const inputValue = '12932689.645' * normalizeNumber;
    const expectedValue = '12,932,689.645';
    const wrapper = mount(<LiskAmount val={inputValue} />);
    expect(wrapper.text()).to.be.equal(expectedValue);
  });

  it('should round to props.roundTo decimal places', () => {
    const inputValue = '12932689.64321' * normalizeNumber;
    const expectedValue = '12,932,689.64';
    const wrapper = mount(<LiskAmount val={inputValue} roundTo={2} />);
    expect(wrapper.text()).to.be.equal(expectedValue);
  });
});
