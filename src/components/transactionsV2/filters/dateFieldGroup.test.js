import React from 'react';
import PropTypes from 'prop-types';
import { mount } from 'enzyme';
import i18n from '../../../i18n';
import DateFieldGroup from './dateFieldGroup';

describe('DateFieldGroup', () => {
  let wrapper;
  const props = {
    t: v => v,
    filters: {
      dateTo: '',
      dateFrom: '',
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
    wrapper = mount(<DateFieldGroup {...props} />, options);
  });

  it('Should render two inputs', () => {
    expect(wrapper).toContainMatchingElements(2, 'input');
  });

  it('Should handle numbers input', () => {
    const expected = {
      dateTo: {
        error: false,
        value: '',
      },
      dateFrom: {
        error: false,
        value: '12.12.16',
      },
    };
    wrapper.find('.dateFromInput input').simulate('change', { target: { name: 'dateFrom', value: '121216' } });
    expect(props.updateCustomFilters).toBeCalledWith(expected);
  });

  describe('Datepicker', () => {
    it('Should toggle datepicker on click', () => {
      expect(wrapper.find('.calendarDropdown').first()).not.toContainMatchingElement('.show');
      wrapper.find('.dropdownWrapper input').first().simulate('click');
      expect(wrapper.find('.calendarDropdown').first()).toContainMatchingElement('.show');
      wrapper.find('.dropdownWrapper input').last().simulate('focus');
      expect(wrapper.find('.calendarDropdown').first()).not.toContainMatchingElement('.show');
      expect(wrapper.find('.calendarDropdown').last()).toContainMatchingElement('.show');
    });

    it('Should handle selectDate on datepicker', () => {
      const newProps = {
        ...props,
        filter: {
          ...props.filters,
          dateFrom: '11.03.19',
        },
      };
      wrapper = mount(<DateFieldGroup {...newProps}/>, options);
      wrapper.find('.dropdownWrapper input').first().simulate('click');
      wrapper.find('Calendar .dayItem').filter('[value="12.03.19"]').first().simulate('click', { target: { value: '12.03.19' } });
      expect(props.updateCustomFilters).toBeCalled();
    });
  });

  describe('Error handling', () => {
    it('Should handle dateFrom greater than dateTo', () => {
      wrapper.setProps({ filters: { dateFrom: '13.12.16', dateTo: '12.12.16' } });
      wrapper.find('.dateToInput input').simulate('change', { target: { name: 'dateTo', value: '12.12.16' } });
      expect(wrapper).toContainMatchingElements(2, '.error input');
      expect(wrapper).toContainMatchingElement('.feedback.show');
    });

    it('Should show error if date before first block', () => {
      wrapper.find('.dateFromInput input').simulate('change', { target: { name: 'dateFrom', value: '111111' } });
      expect(wrapper).toContainMatchingElements(1, '.error input');
      expect(wrapper).toContainMatchingElement('.feedback.show');
    });

    it('Should show error if invalid date format', () => {
      wrapper.find('.dateFromInput input').simulate('change', { target: { name: 'dateFrom', value: '12.13.16' } });
      expect(wrapper).toContainMatchingElements(1, '.error input');
      expect(wrapper).toContainMatchingElement('.feedback.show');
    });
  });
});
