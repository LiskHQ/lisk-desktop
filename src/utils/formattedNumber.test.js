import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import FormattedNumber from './formattedNumber';

describe('FormattedNumber', () => {
  it('renders 0 if raw value is 0', () => {
    const value = {
      raw: 0,
      formatted: '0',
    };
    const wrapper = mount(<FormattedNumber val={value.raw} />);
    expect(wrapper.text()).to.equal(value.formatted);
  });

  it('renders 1,000 if raw value is 1000', () => {
    const value = {
      raw: 1234,
      formatted: '1,234',
    };
    const wrapper = mount(<FormattedNumber val={value.raw} />);
    expect(wrapper.text()).to.equal(value.formatted);
  });

  it('renders 1,000.95 if raw value is 1000', () => {
    const value = {
      raw: 1234.56,
      formatted: '1,234.56',
    };
    const wrapper = mount(<FormattedNumber val={value.raw} />);
    expect(wrapper.text()).to.equal(value.formatted);
  });

  it('renders 10.01 if raw value is 10.01', () => {
    const value = {
      raw: 123.45,
      formatted: '123.45',
    };
    const wrapper = mount(<FormattedNumber val={value.raw} />);
    expect(wrapper.text()).to.equal(value.formatted);
  });
});
