import React from 'react';
import { mount } from 'enzyme';
import FilterContainer from './filterContainer';

describe('filterContainer', () => {
  let wrapper;

  const props = {
    saveFilters: jest.fn(),
    customFilters: {},
  };

  beforeEach(() => {
    wrapper = mount(<FilterContainer {...props} />);
  });

  it('should call saveFilters', () => {
    wrapper.find('input.message').simulate('change', { target: { name: 'message', value: 'test' } });
    wrapper.find('form').simulate('submit');
    expect(props.saveFilters).toBeCalled();
  });

  it('should call saveFilters on enter pressed', () => {
    wrapper.find('input.message').simulate('change', { event: { target: { value: 'testing' } } });
    wrapper.find('form').simulate('submit');
    expect(props.saveFilters).toBeCalled();
  });

  it('should call saveFilters on enter pressed with empty values', () => {
    wrapper.find('form').simulate('submit');
    expect(props.saveFilters).toBeCalled();
  });

  it('should update filter values if props.filters was updated', () => {
    const amountFrom = '1';
    wrapper.setProps({
      customFilters: { amountFrom },
    });
    wrapper.update();
    expect(wrapper.find('.amountFromInput input')).toHaveProp('value', amountFrom);
  });
});
