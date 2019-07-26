import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import AutoresizeTextarea from './AutoresizeTextarea';

describe('AutoresizeTextarea', () => {
  let wrapper;
  const props = {
    className: 'test',
    defaultValue: 'test',
  };

  beforeEach(() => {
    wrapper = mount(<AutoresizeTextarea {...props} />);
  });

  it('should render with passed props', () => {
    const textarea = wrapper.find('textarea');
    expect(textarea).to.have.className(props.className);
    expect(textarea.html()).to.contain(props.defaultValue);
  });
});
