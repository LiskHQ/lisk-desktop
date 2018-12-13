import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { spy } from 'sinon';
import ReferenceInput from './';

describe('ReferenceInput', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      handleChange: spy(),
      className: 'test',
      reference: { value: '123L', error: '' },
      label: 'test',
      context: { referenceInput: {} },
    };
    wrapper = mount(<ReferenceInput {...props} />);
  });

  it('should render Input', () => {
    expect(wrapper.find('Input')).to.have.lengthOf(1);
  });

  it('should call onChange', () => {
    wrapper.find('Input').first().props().onChange('test');
    expect(props.handleChange).to.have.been.calledWith('test');
  });
});
