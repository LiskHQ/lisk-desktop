import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import Box from './index';

describe('Box', () => {
  let wrapper;

  const props = {
    className: 'test',
  };

  beforeEach(() => {
    wrapper = mount(<Box {...props} ><header>Activities</header></Box>);
  });

  it('Should render child tags', () => {
    expect(wrapper.find('header').html()).to.be.equal('<header>Activities</header>');
  });
});
