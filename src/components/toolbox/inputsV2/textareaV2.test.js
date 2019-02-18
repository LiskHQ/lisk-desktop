import React from 'react';
import { expect } from 'chai';
import { spy } from 'sinon';
import { mount } from 'enzyme';
import TextareaV2 from './textareaV2';

describe('TextareaV2', () => {
  let wrapper;
  const props = {
    className: '',
    defaultValue: 'test',
    onChange: spy(),
    setRef: spy(),
  };

  it('should render with passed props', () => {
    wrapper = mount(<TextareaV2 {...props} />);
    expect(wrapper).to.have.className(props.className);
    expect(wrapper.html()).to.be.contain(props.defaultValue);
    wrapper.simulate('change', { target: { value: 'test' } });
    expect(props.onChange).to.have.been.calledWith();
  });

  it('should not put undefined as className if className is not on props', () => {
    const propWithoutClassName = {
      defaultValue: 'test',
    };
    wrapper = mount(<TextareaV2 {...propWithoutClassName} />);
    expect(wrapper).not.to.have.className('undefined');
  });
});
