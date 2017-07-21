import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import LiskAmount from './';

describe('<LiskAmount />', () => {
  const normalizeNumber = 100000000;
  it('should render "12932689.645" as "12,932,689.645"', () => {
    const inputValue = '12932689.645' * normalizeNumber;
    const expectedValue = '12,932,689.645';
    const wrapper = mount(<LiskAmount val={inputValue} />);
    expect(wrapper.text()).to.be.equal(expectedValue);
  });
});
