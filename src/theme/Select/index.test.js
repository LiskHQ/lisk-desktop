import React from 'react';
import { mount } from 'enzyme';
import Select from './index';

describe('Select toolbox component', () => {
  const props = {
    options: [
      { label: 'option-1', value: 0 },
      { label: 'option-2', value: 1 },
      { label: 'option-3', value: 2 },
    ],
    onChange: jest.fn(),
    placeholder: 'option-1',
  };

  it('Should render 3 options with first option being the selected one', () => {
    const wrapper = mount(<Select {...props} />);
    expect(wrapper).toContainMatchingElements(3, '.option');
    expect(wrapper.find('input')).toHaveValue(props.options[0].label);
  });

  it('Should render with second option as selected and change on click', () => {
    const newProps = { ...props, selected: 1 };
    const wrapper = mount(<Select {...newProps} />);
    expect(wrapper.find('input')).toHaveValue(props.options[1].label);
    wrapper.find('input').simulate('click');
    wrapper
      .find('.option')
      .first()
      .simulate('click', { target: { getAttribute: () => 0 } });
    expect(wrapper.find('input')).toHaveValue(props.options[1].label);
  });
});
