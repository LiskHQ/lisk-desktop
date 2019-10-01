import React from 'react';
import { mount } from 'enzyme';
import FilterContainer from './filterContainer';

describe('filterContainer', () => {
  let wrapper;

  const props = {
    saveFilters: jest.fn(),
    customFilters: {},
    updateCustomFilters: jest.fn(),
  };

  beforeEach(() => {
    wrapper = mount(<FilterContainer {...props} />);
  });

  it('should call saveFilters', () => {
    wrapper.find('.message-field textarea').simulate('change', { target: { name: 'message', value: 'test' } });
    expect(props.updateCustomFilters).toBeCalledWith({ message: 'test' });
    wrapper.find('form').simulate('submit');
    expect(props.saveFilters).toBeCalled();
  });

  it('should call saveFilters on enter pressed', () => {
    wrapper.find('.message-field textarea').simulate('change', { event: { target: { value: 'testing' } } });
    wrapper.find('form').simulate('submit');
    expect(props.saveFilters).toBeCalled();
  });

  it('should call saveFilters on enter pressed with empty values', () => {
    wrapper.find('form').simulate('submit');
    expect(props.saveFilters).toBeCalled();
  });
});
