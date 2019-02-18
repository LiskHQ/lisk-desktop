import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { spy } from 'sinon';
import ConverterV2 from './converterV2';

describe('Converter V2', () => {
  let wrapper;

  const props = {
    getPriceTicker: spy(),
    settings: {
      currency: 'EUR',
    },
    value: 1,
    error: false,
    className: 'test',
    priceTicker: { LSK: { USD: 123, EUR: 12 } },
  };

  it('shold render ConverterV2 component', () => {
    wrapper = mount(<ConverterV2 {...props} />);
    expect(props.getPriceTicker).to.have.been.calledWith();
    expect(wrapper.find('.wrapper')).to.have.className(props.className);
    expect(wrapper.find('.price')).to.include.text(props.priceTicker.LSK.EUR);
    expect(wrapper.find('.price')).to.include.text(props.settings.currency);
  });

  it('should use USD if no settings.currency', () => {
    const noSettingsProps = {
      ...props,
      settings: {},
    };
    wrapper = mount(<ConverterV2 {...noSettingsProps} />);
    expect(wrapper.find('.price')).to.include.text(props.priceTicker.LSK.USD);
    expect(wrapper.find('.price')).to.include.text('USD');
  });

  it('should render 0.00 if value is NaN and has error', () => {
    const invalidProps = {
      ...props,
      value: 'aaa',
      error: true,
    };
    wrapper = mount(<ConverterV2 {...invalidProps} />);
    expect(wrapper.find('.price')).to.include.text('0.00');
  });

  it('should not render .price element if value === ""', () => {
    const newProps = {
      ...props,
      className: undefined,
      value: '',
    };
    wrapper = mount(<ConverterV2 {...newProps} />);
    expect(wrapper).to.not.have.descendants('.price');
    expect(wrapper).to.not.have.descendants('.undefined');
  });
});
