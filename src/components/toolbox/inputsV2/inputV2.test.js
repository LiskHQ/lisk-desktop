import React from 'react';
import { mount } from 'enzyme';
import InputV2 from './inputV2';

describe('InputV2', () => {
  let wrapper;
  const props = {
    className: 'test',
    defaultValue: 'test',
    onChange: jest.fn(),
  };

  it('should render with passed props', () => {
    wrapper = mount(<InputV2 {...props} />);
    expect(wrapper.find('input')).toHaveValue(props.defaultValue);
    expect(wrapper.find('input')).toHaveClassName(props.className);
    wrapper.simulate('change', { target: { value: 'test' } });
    expect(props.onChange).toBeCalled();
  });

  it('should pass size as className ', () => {
    const propWithoutClassName = {
      defaultValue: 'test',
      size: 'l',
    };
    wrapper = mount(<InputV2 {...propWithoutClassName} />);
    expect(wrapper.find('input')).toHaveClassName('l');
  });

  it('Should render with error class', () => {
    const propWithError = {
      error: true,
    };
    wrapper = mount(<InputV2 {...propWithError} />);
    expect(wrapper.find('input')).toHaveClassName('error');
  });
});
