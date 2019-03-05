import React from 'react';
import PropTypes from 'prop-types';
import { mount } from 'enzyme';
import i18n from '../../../i18n';
import MessageFieldGroup from './messageFieldGroup';

describe('MessageFieldGroup', () => {
  let wrapper;
  const props = {
    t: v => v,
    filters: {},
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
    wrapper = mount(<MessageFieldGroup {...props} />, options);
  });

  it('Should render only one textarea', () => {
    expect(wrapper).toContainExactlyOneMatchingElement('textarea');
  });

  it('Should call updateCustomFilters onChange', () => {
    const value = 'Lorem ipsum dolor sit amet';
    const expected = {
      message: {
        error: false,
        value,
      },
    };
    wrapper.find('textarea').simulate('change', { target: { name: 'message', value } });
    expect(props.updateCustomFilters).toBeCalledWith(expected);
  });

  describe('Error handling', () => {
    it('Should show error if message too long', () => {
      const value = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit volutpat.';
      wrapper.find('textarea').simulate('change', { target: { name: 'message', value } });
      expect(wrapper).toContainMatchingElement('.error textarea');
      expect(wrapper).toContainMatchingElement('.feedback.show');
    });
  });
});
