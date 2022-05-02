import React from 'react';
import { mount } from 'enzyme';
import Input from './Input';

describe('Input', () => {
  let wrapper;
  const props = {
    className: 'test',
    defaultValue: 'test',
    onChange: jest.fn(),
  };

  it('should render with passed props', () => {
    wrapper = mount(<Input {...props} />);
    expect(wrapper.find('input')).toHaveValue(props.defaultValue);
    expect(wrapper.find('input')).toHaveClassName(props.className);
    wrapper.find('.input').simulate('change', { target: { value: 'test' } });
    expect(props.onChange).toBeCalled();
  });

  it('should pass size as className ', () => {
    const propWithoutClassName = {
      defaultValue: 'test',
      size: 'l',
    };
    wrapper = mount(<Input {...propWithoutClassName} />);
    expect(wrapper.find('.wrapper').at(0)).toHaveClassName('l');
  });

  it('Should render with error class', () => {
    const propWithError = {
      error: true,
    };
    wrapper = mount(<Input {...propWithError} />);
    expect(wrapper.find('input')).toHaveClassName('error');
  });
});
