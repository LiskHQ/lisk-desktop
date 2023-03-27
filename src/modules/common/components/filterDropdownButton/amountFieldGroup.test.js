import React from 'react';
import { mount } from 'enzyme';
import AmountFieldGroup from './amountFieldGroup';

describe('AmountFieldGroup', () => {
  let wrapper;
  const props = {
    t: (v) => v,
    filters: {
      amountTo: '',
      amountFrom: '',
    },
    handleKeyPress: jest.fn(),
    updateCustomFilters: jest.fn(),
  };

  beforeEach(() => {
    wrapper = mount(<AmountFieldGroup {...props} />);
  });

  it('Should render two inputs', () => {
    expect(wrapper).toContainMatchingElements(2, 'input');
  });

  it('Should handle numbers input', () => {
    const expected = {
      amountTo: {
        error: false,
        loading: false,
        value: '',
      },
      amountFrom: {
        error: false,
        loading: false,
        value: '123',
      },
    };
    wrapper
      .find('.amountFromInput input')
      .simulate('change', { target: { name: 'amountFrom', value: '123' } });
    jest.advanceTimersByTime(300);
    expect(props.updateCustomFilters).toBeCalledWith(expected);
  });

  describe('Error handling', () => {
    it('Should handle amountFrom greater than amountTo', () => {
      wrapper
        .find('.amountFromInput input')
        .simulate('change', { target: { name: 'amountFrom', value: '99.9' } });
      wrapper.setProps({ filters: { ...props.filters, amountFrom: '99.9' } });
      wrapper
        .find('.amountToInput input')
        .simulate('change', { target: { name: 'amountTo', value: '99' } });
      jest.advanceTimersByTime(300);
      wrapper.update();
      expect(wrapper.find('.amount-feedback').hostNodes()).toHaveText(
        'Max amount must be greater than Min amount'
      );
    });

    it('Should show error if invalid amount value', () => {
      wrapper
        .find('.amountFromInput input')
        .simulate('change', { target: { name: 'amountFrom', value: '123.123.' } });
      jest.advanceTimersByTime(300);
      wrapper.update();
      expect(wrapper.find('.amount-feedback').hostNodes()).toHaveText('Invalid amount');
    });
  });
});
