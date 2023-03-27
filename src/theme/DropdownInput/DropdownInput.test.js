import { mount } from 'enzyme';
import React from 'react';
import DropdownInput from './DropdownInput';

describe('InputWithDropdown', () => {
  it('should render with passed props', () => {
    const onChange = jest.fn();
    const wrapper = mount(
      <DropdownInput onChange={onChange}>
        <span>element 1</span>
        <span>element 2</span>
        <span>element 3</span>
      </DropdownInput>
    );

    expect(wrapper).toContainMatchingElement('.input-with-dropdown-container');
    expect(wrapper).toContainMatchingElement('.input-with-dropdown-input');
    expect(wrapper).toContainMatchingElement('.input-with-dropdown-dropdown');
    expect(wrapper).toContainMatchingElement('.input-with-dropdown-dropdown');

    wrapper.find('.input').simulate('change', { target: { value: 'test' } });
    expect(onChange).toHaveBeenCalled();
  });
});
