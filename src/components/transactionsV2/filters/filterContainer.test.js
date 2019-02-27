import React from 'react';
import { mount } from 'enzyme';
import PropTypes from 'prop-types';
import { PrimaryButtonV2 } from '../../toolbox/buttons/button';
import FilterContainer from './filterContainer';
import i18n from '../../../i18n';
import keyCodes from '../../../constants/keyCodes';

describe('filterContainer', () => {
  let wrapper;
  const options = {
    context: { i18n },
    childContextTypes: {
      i18n: PropTypes.object.isRequired,
    },
  };

  const props = {
    saveFilters: jest.fn(),
    t: v => v,
    customFilters: {},
    updateCustomFilters: jest.fn(),
  };

  beforeEach(() => {
    wrapper = mount(<FilterContainer {...props} />, options);
  });

  it('should call saveFilters', () => {
    wrapper.find('.message-field input').simulate('change', { target: { name: 'message', value: 'test' } });
    expect(props.updateCustomFilters).toBeCalledWith({ message: 'test' });
    wrapper.find(PrimaryButtonV2).simulate('click');
    expect(props.saveFilters).toBeCalled();
  });

  it('should toggle Filters dropdown', () => {
    expect(wrapper).not.toContainMatchingElement('.dropdown.show');
    wrapper.find('.filterTransactions').simulate('click');
    expect(wrapper).toContainMatchingElement('.dropdown.show');
    wrapper.find('.filterTransactions').simulate('click');
    expect(wrapper).not.toContainMatchingElement('.dropdown.show');
  });

  it('should call saveFilters on enter pressed', () => {
    wrapper.find('.message-field input').simulate('keyDown', { keyCode: keyCodes.enter });
    expect(props.saveFilters).toBeCalled();
  });
});
