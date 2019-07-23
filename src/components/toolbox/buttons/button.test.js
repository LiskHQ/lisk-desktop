import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { Button } from './button';

describe('Button wrapper', () => {
  it('Creates only one instance of the button', () => {
    const wrappedButton = mount(<Button />, {});
    expect(wrappedButton.find('Button').length).to.equal(1);
  });
});
