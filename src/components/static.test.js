import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import Static from './static';

describe('<Static />', () => {
  it('allows us to set props', () => {
    const wrapper = mount(<Static txt="baz" />);
    expect(wrapper.props().txt).to.equal('baz');
    wrapper.setProps({ txt: 'foo' });
    expect(wrapper.props().txt).to.equal('foo');
  });
});
