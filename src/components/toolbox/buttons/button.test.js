import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { Button, SecondaryLightButton, ActionButton } from './button';

describe('Button wrapper', () => {
  it('Creates only one instance of the button', () => {
    const wrappedButton = mount(<Button />, {});
    expect(wrappedButton.find('Button').length).to.equal(1);
  });

  it('Creates only one instance of the SecondaryLightButton', () => {
    const wrappedButton = mount(<SecondaryLightButton />, {});
    expect(wrappedButton.find('Button').length).to.equal(1);
  });

  it('Creates only one instance of the ActionButton', () => {
    const wrappedButton = mount(<ActionButton />, {});
    expect(wrappedButton.find('Button').length).to.equal(1);
  });
});
