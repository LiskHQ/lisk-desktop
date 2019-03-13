import React from 'react';
import PropTypes from 'prop-types';
import { mount } from 'enzyme';
import i18n from '../../../i18n';
import AmountFieldGroup from './amountFieldGroup';

describe('AmountFieldGroup', () => {
  let wrapper;
  const props = {
    t: v => v,
    filters: {
      amountTo: '',
      amountFrom: '',
    },
    handleKeyPress: jest.fn(),
    updateCustomFilters: jest.fn(),
  };
  const options = {
    context: { i18n },
    childContextTypes: {
      i18n: PropTypes.object.isRequired,
    },
  };

  beforeEach(() => {
    wrapper = mount(<AmountFieldGroup {...props} />, options);
  });

  it('Should render two inputs', () => {
    expect(wrapper).toContainMatchingElements(2, 'input');
  });

  it('Should handle numbers input', () => {
    const expected = {
      amountTo: {
        error: false,
        value: '',
      },
      amountFrom: {
        error: false,
        value: '123',
      },
    };
    wrapper.find('.amountFromInput input').simulate('change', { target: { name: 'amountFrom', value: '123' } });
    expect(props.updateCustomFilters).toBeCalledWith(expected);
  });

  describe('Error handling', () => {
    it('Should handle amountFrom greater than amountTo', () => {
      wrapper.find('.amountFromInput input').simulate('change', { target: { name: 'amountFrom', value: '99.9' } });
      wrapper.setProps({ filters: { amountFrom: '99.9' } });
      wrapper.find('.amountToInput input').simulate('change', { target: { name: 'amountTo', value: '99' } });
      expect(wrapper).toContainMatchingElements(2, '.error input');
      expect(wrapper).toContainMatchingElement('.feedback.show');
    });

    it('Should show error if invalid amount value', () => {
      wrapper.find('.amountFromInput input').simulate('change', { target: { name: 'amountFrom', value: '123.123.' } });
      expect(wrapper).toContainMatchingElements(1, '.error input');
      expect(wrapper).toContainMatchingElement('.feedback.show');
    });
  });
});
