import React from 'react';
import { mount } from 'enzyme';
import DropdownFilter from './dropdownFilter';

describe('DropdownFilter', () => {
  const props = {
    t: v => v,
    filters: {
      type: '',
    },
    name: 'type',
    updateCustomFilters: jest.fn(),
  };
  const wrapper = mount(<DropdownFilter {...props} />);

  it('should handle input selection', () => {
    wrapper.find('Select.input').simulate('click');
    wrapper.find('span.option').at(0).simulate('click');
    expect(props.updateCustomFilters).toBeCalled();
  });
});
