import React from 'react';
import { mount } from 'enzyme';
import SelectFilter from './selectFilter';

describe.skip('SelectFilter', () => {
  const props = {
    t: v => v,
    filters: {
      type: '',
    },
    name: 'type',
    updateCustomFilters: jest.fn(),
  };
  const wrapper = mount(<SelectFilter {...props} />);

  it('should handle input selection', () => {
    wrapper.find('Select.input').simulate('click');
    wrapper.find('span.option').at(0).simulate('click');
    expect(props.updateCustomFilters).toBeCalled();
  });
});
