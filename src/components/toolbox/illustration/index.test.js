import React from 'react';
import { mount } from 'enzyme';
import Illustration from './index';

describe('Illustration', () => {
  it('should render img', () => {
    const wrapper = mount(<Illustration />);
    expect(wrapper.find('img')).toHaveLength(1);
  });

});

