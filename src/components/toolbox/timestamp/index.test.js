import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';
import { Time } from './index';

sinon.useFakeTimers({
  now: new Date(2017, 1, 15).getTime(),
  toFake: ['setTimeout', 'clearTimeout', 'Date'],
});
describe('Time', () => {
  it('shows "5 months" for the equivalent timestamp (35929631)', () => {
    const inputValue = 35929631;
    const expectedValue = '5 months';
    const wrapper = mount(<Time label={inputValue} />);
    // const html = wrapper.find('span').text();
    expect(wrapper.find('span').text()).to.be.equal(expectedValue);
  });
});
