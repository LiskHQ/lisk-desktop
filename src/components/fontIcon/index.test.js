import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { FontIcon } from './index';

describe('FontIcon', () => {
  const props = {
    value: 'arrow-right',
    className: 'test',
  };
  let wrapper;
  beforeEach(() => {
    wrapper = mount(<FontIcon {...props} />);
  });

  it("Should className include 'test' and 'arrow-right'", () => {
    const expectedValue = /.*icon.*arrow-right.*test/;
    const reg = new RegExp(expectedValue);
    const className = wrapper.find('span').props().className;
    expect(reg.test(className)).to.be.equal(true);
  });
});

