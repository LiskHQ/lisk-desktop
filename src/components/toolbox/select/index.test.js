import React from 'react';
import { shallow } from 'enzyme';
import Select from './index';

describe('Select toolbox component', () => {
  const props = {
    options: [
      { label: 'option-1' },
      { label: 'option-2' },
      { label: 'option-3' },
    ],
    onChange: jest.fn(),
  };

  it('Should render 3 options with first option being the selected one', () => {
    const wrapper = shallow(<Select {...props} />);
    expect(wrapper).toContainMatchingElements(3, '.option');
    expect(wrapper.find('InputV2')).toHaveValue(props.options[0].label);
  });

  it('Should render with second option as selected and change on click', () => {
    const newProps = { ...props, selected: 1 };
    const wrapper = shallow(<Select {...newProps} />);
    expect(wrapper.find('InputV2')).toHaveValue(props.options[1].label);
    wrapper.find('InputV2').simulate('focus');
    wrapper.find('.option').first().simulate('click', { target: { dataset: { index: 0 } } });
    expect(wrapper.find('InputV2')).toHaveValue(props.options[0].label);
  });
});
