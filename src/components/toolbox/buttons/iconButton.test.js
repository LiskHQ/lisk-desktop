import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { IconButton as ToolBoxIconButton } from 'react-toolbox/lib/button';
import IconButton from './iconButton';

describe('IconButton wrapper', () => {
  it('Creates only one instance of toolbox icon button', () => {
    const wrappedButton = mount(<IconButton />, {});
    expect(wrappedButton.find(ToolBoxIconButton)).to.have.lengthOf(1);
  });
});

