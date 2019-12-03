import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import ThemeContext from '../../../contexts/theme';
import Icon from './index';

describe('Icon', () => {
  it('should render an image with given name andcustom property', () => {
    const wrapper = mount(<Icon name="user" customprop="customValue" />);
    expect(wrapper.find('img').props().src).to.be.equal('test-file-stub');
    expect(wrapper.find('img').props().customprop).to.be.equal('customValue');
  });

  it('should render dark icons if available', () => {
    const wrapper = mount(<ThemeContext.Provider value="dark"><Icon name="fileOutline" /></ThemeContext.Provider>);
    expect(wrapper.find('img').props().src).to.be.equal('test-file-stub');
  });
});
