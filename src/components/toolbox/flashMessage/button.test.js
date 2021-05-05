import React from 'react';
import { shallow } from 'enzyme';
import Button from './button';

describe('FlashMessage.Button', () => {
  it('should render properly', () => {
    const wrapper = shallow(<Button>Hello</Button>);
    expect(wrapper).toBeDefined();
  });
});
