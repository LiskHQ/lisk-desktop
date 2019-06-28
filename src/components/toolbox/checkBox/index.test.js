import React from 'react';
import { mount } from 'enzyme';
import CheckBox from './index';

describe('CheckBox', () => {
  const props = {
    added: true,
    removed: false,
    onChange: jest.fn(),
  };

  it('should render checkmark icon if props.checked is true', () => {
    const wrapper = mount(<CheckBox {...props} checked />);
    expect(wrapper).toContainExactlyOneMatchingElement('.checked');
  });

  it('should render with "accent" class if props.accent is true', () => {
    const wrapper = mount(<CheckBox {...props} accent />);
    expect(wrapper).toContainExactlyOneMatchingElement('.unchecked');
    expect(wrapper).toContainExactlyOneMatchingElement('.accent');
  });

  it('should render with "removed" class if props.removed is true', () => {
    const wrapper = mount(<CheckBox {...props} removed />);
    expect(wrapper).toContainExactlyOneMatchingElement('.removed');
  });
});
