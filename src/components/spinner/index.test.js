import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import Spinner from './index';

describe('Spinner', () => {
  it('should render 1 span and 3 div tags', () => {
    const wrapper = mount(<Spinner />);
    expect(wrapper.find('span')).to.have.lengthOf(1);
    expect(wrapper.find('div')).to.have.lengthOf(3);
  });
});

