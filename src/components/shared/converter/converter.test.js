import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { spy } from 'sinon';
import Converter from './converter';
import { tokenMap } from '../../../constants/tokens';

describe('Converter', () => {
  let wrapper;

  const props = {
    token: tokenMap.LSK.key,
    settings: {
      currency: 'EUR',
    },
    value: 1,
    error: false,
    className: 'test',
    priceTicker: { LSK: { USD: 123, EUR: 12 } },
    pricesRetrieved: spy(),
  };

  it('shold render Converter component', () => {
    wrapper = mount(<Converter {...props} />);
    expect(props.pricesRetrieved).to.have.been.calledWith();
    expect(wrapper.find('.wrapper')).to.have.className(props.className);
    expect(wrapper.find('.price')).to.include.text(props.priceTicker.LSK.EUR);
    expect(wrapper.find('.price')).to.include.text(props.settings.currency);
  });

  it('should render 0.00 if value is NaN and has error', () => {
    const invalidProps = {
      ...props,
      value: 'aaa',
      error: true,
    };
    wrapper = mount(<Converter {...invalidProps} />);
    expect(wrapper.find('.price')).to.include.text('0.00');
  });

  it('should not render .price element if value === ""', () => {
    const newProps = {
      ...props,
      className: undefined,
      value: '',
    };
    wrapper = mount(<Converter {...newProps} />);
    expect(wrapper).to.not.have.descendants('.price');
    expect(wrapper).to.not.have.descendants('.undefined');
  });
});
