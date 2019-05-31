import React from 'react';
import { mount } from 'enzyme';
import CheckBox from './index';

describe('CheckBox', () => {
  const props = {
    added: true,
    removed: false,
    onChange: () => {},
  };

  it('should render checkmark icon if props.checked is true', () => {
    const wrapper = mount(<CheckBox {...props} checked={true} />);
    expect(wrapper.find('img').props()).toHaveProperty('src', 'test-file-stub');
  });

  it('should render with "accent" class if props.accent is true', () => {
    const wrapper = mount(<CheckBox {...props} accent={true} />);
    expect(wrapper.find('.checked').hasClass('accent')).toEqual(true);
  });

  it('should render with "removed" class if props.removed is true', () => {
    const wrapper = mount(<CheckBox {...props} removed={true} />);
    expect(wrapper.find('span.unchecked').hasClass('removed')).toEqual(true);
  });
});

