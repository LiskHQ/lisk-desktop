import React from 'react';
import { mount } from 'enzyme';
import { tokenMap } from '@token/configuration';
import Converter from './converter';

describe('Converter', () => {
  let wrapper;

  const props = {
    currency: 'EUR',
    value: 1,
    error: false,
    className: 'test',
    token: tokenMap.LSK.key,
    priceTicker: { LSK: { USD: 123, EUR: 12 } },
  };

  it('should render Converter component', () => {
    wrapper = mount(<Converter {...props} />);
    expect(wrapper.find('.wrapper').hasClass(props.className)).toBe(true);
    expect(wrapper.find('.price').text()).toContain(props.priceTicker.LSK.EUR);
    expect(wrapper.find('.price').text()).toContain(props.currency);
  });

  it('should render 0.00 if value is NaN and has error', () => {
    const invalidProps = {
      ...props,
      value: 'aaa',
      error: true,
    };
    wrapper = mount(<Converter {...invalidProps} />);
    expect(wrapper.find('.price').text()).toContain('0.00');
  });

  it('should not render .price element if value === ""', () => {
    const newProps = {
      ...props,
      className: undefined,
      value: '',
    };
    wrapper = mount(<Converter {...newProps} />);
    expect(wrapper.find('.price').exists()).toBe(false);
  });
});
