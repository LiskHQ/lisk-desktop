import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import LiskAmount from './index';
import { mockAppsTokens } from '../../__fixtures__';

describe('LiskAmount', () => {
  const normalizeNumber = 100000000;
  const mockToken = mockAppsTokens.data[0];

  it('should normalize "12932689.645" as "12,932,689.645"', () => {
    const inputValue = '12932689.645' * normalizeNumber;
    const expectedValue = `12,932,689.645 ${mockToken.symbol}`;
    const wrapper = mount(<LiskAmount val={inputValue} token={mockToken} />);
    expect(wrapper.text()).to.be.equal(expectedValue);
  });

  it('should round to props.roundTo decimal places', () => {
    const inputValue = '12932689.64321' * normalizeNumber;
    const expectedValue = `12,932,689.64 ${mockToken.symbol}`;
    const wrapper = mount(<LiskAmount val={inputValue} showRounded token={mockToken} />);
    expect(wrapper.text()).to.be.equal(expectedValue);
  });
});
