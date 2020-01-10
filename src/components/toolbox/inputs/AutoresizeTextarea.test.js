import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import AutoResizeTextarea from './AutoResizeTextarea';

describe('AutoResizeTextarea', () => {
  let wrapper;
  const props = {
    className: 'test',
    value: 'test',
    onChange: jest.fn(),
  };

  beforeEach(() => {
    wrapper = mount(<AutoResizeTextarea {...props} />);
  });

  it('should render with passed props', () => {
    const textarea = wrapper.find('textarea');
    expect(textarea).to.have.className(props.className);
    expect(textarea.html()).to.contain(props.value);
  });

  it('should resize on entering more than one line of text', () => {
    const textarea = wrapper.find('textarea');
    expect(textarea).to.have.className(props.className);
    expect(textarea.html()).to.contain(props.value);
    const value = 'Now the text is longer than a single line';
    wrapper.setProps({ value });
    expect(textarea.html()).to.contain(value);
    wrapper.setProps({ value });
    wrapper.setProps({ className: 'test2' });
    expect(textarea.html()).to.contain('style="height: ');
  });
});
