import React from 'react';
import { mount } from 'enzyme';
import SelectFilter from './selectFilter';

describe('SelectFilter', () => {
  const props = {
    t: (v) => v,
    filters: {
      moduleCommand: '',
    },
    placeholder: 'Sample title',
    name: 'type',
    updateCustomFilters: jest.fn(),
    label: 'Type',
  };

  it('should handle input selection', () => {
    const wrapper = mount(<SelectFilter {...props} />);
    wrapper.find('Select.input').simulate('click');
    wrapper.find('span.option').at(0).simulate('click');
    expect(props.updateCustomFilters).toBeCalled();
  });
});
