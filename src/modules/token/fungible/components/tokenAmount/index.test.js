import { expect } from 'chai';
import { mountWithRouter } from 'src/utils/testHelpers';
import LiskAmount from './index';
import { mockAppsTokens } from '../../__fixtures__';

describe('LiskAmount', () => {
  const normalizeNumber = 100000000;
  const mockToken = mockAppsTokens.data[0];

  it('should normalize "12932689.645" as "12,932,689.645"', () => {
    const inputValue = '12932689.645' * normalizeNumber;
    const expectedValue = `12,932,689.645 ${mockToken.symbol}`;
    const wrapper = mountWithRouter(LiskAmount, { val: inputValue, token: mockToken });
    expect(wrapper.text()).to.be.equal(expectedValue);
  });

  it('should round to props.roundTo decimal places', () => {
    const inputValue = '12932689.64321' * normalizeNumber;
    const expectedValue = `12,932,689.64 ${mockToken.symbol}`;
    const wrapper = mountWithRouter(LiskAmount, {
      val: inputValue,
      showRounded: true,
      token: mockToken,
    });
    expect(wrapper.text()).to.be.equal(expectedValue);
  });
  it('should return 0', () => {
    const wrapper = mountWithRouter(LiskAmount, { val: 12 });
    expect(wrapper.text()).to.be.equal('0 ');
  });
});
