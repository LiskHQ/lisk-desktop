import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import MultiStepProgressBar from './index';

describe('MultiStepProgressBar', () => {
  const props = {
    total: 3,
    current: 0,
  };

  const wrapper = mount(<MultiStepProgressBar {...props} />);

  it('should render component with the amount of divs as total prop', () => {
    expect(wrapper.find('.container').children()).to.have.lengthOf(3);
  });
});
