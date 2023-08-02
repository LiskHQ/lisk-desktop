import { mountWithRouter } from 'src/utils/testHelpers';
import { tokenMap } from '@token/fungible/consts/tokens';
import Converter from './converter';
import useFiatRates from '../../hooks/useFiatRates';

jest.mock('../../hooks/useFiatRates');

describe('Converter', () => {
  let wrapper;

  const props = {
    currency: 'EUR',
    value: 1,
    error: false,
    className: 'test',
    token: tokenMap.LSK.key,
    priceTicker: { LSK: { USD: 123, EUR: 12 } },
    tokenSymbol: 'LSK',
  };

  useFiatRates.mockReturnValue(props.priceTicker);

  it('should render Converter component 1', () => {
    wrapper = mountWithRouter(Converter, props);
    expect(wrapper.find('.wrapper').first().hasClass(props.className)).toBe(true);
    expect(wrapper.find('.price').text()).toContain('~12.00 EUR');
  });

  it('should render 0.00 if value is NaN and has error', () => {
    const invalidProps = {
      ...props,
      value: 'aaa',
      error: true,
    };
    wrapper = mountWithRouter(Converter, invalidProps);
    expect(wrapper.find('.price').text()).toContain('0.00');
  });

  it('should not render .price element if value === ""', () => {
    const newProps = {
      ...props,
      className: undefined,
      value: '',
    };
    wrapper = mountWithRouter(Converter, newProps);
    expect(wrapper.find('.price').exists()).toBe(false);
  });

  it('should not render placeholder', () => {
    const newProps = {
      ...props,
      value: '',
      emptyPlaceholder: 'test-placeholder',
      tokenSymbol: null,
    };
    wrapper = mountWithRouter(Converter, newProps);
    expect(wrapper.text()).toContain('test-placeholder');
  });
});
