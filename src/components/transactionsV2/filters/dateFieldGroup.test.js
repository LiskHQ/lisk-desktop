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

  describe('Error handling', () => {
    it('Should handle dateFrom greater than dateTo', () => {
      wrapper.find('.dateFromInput input').simulate('change', { target: { name: 'dateFrom', value: '13.12.16' } });
      wrapper.setProps({ filters: { dateFrom: '13.12.16' } });
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
