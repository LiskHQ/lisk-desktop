import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import Register from './register';

describe('Register Process', () => {
  it('Should render on initial step -> Choose Avatar', () => {
    const wrapper = mount(<Register />);
    expect(wrapper.find('ChooseAvatar')).to.have.length(1);
  });
});
