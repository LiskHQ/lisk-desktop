import React from 'react';
import { shallow } from 'enzyme';
import Title from './title';

describe('Dialog.Title component', () => {
  it('should render only if children is not empty', () => {
    const title = 'Dummy title';
    const wrapper = shallow(<Title>{title}</Title>);
    expect(wrapper).not.toBeEmptyRender();
    expect(wrapper).toHaveText(title);
    wrapper.setProps({ children: null });
    expect(wrapper).toBeEmptyRender();
  });
});
