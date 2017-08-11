import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import store from '../../store';
import RegisterDelegate from './index';

describe('RegisterDelegate HOC', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(<Provider store={store}><RegisterDelegate closeDialog={() => {}} /></Provider>);
  });

  it('should render RegisterDelegate', () => {
    expect(wrapper.find('RegisterDelegate')).to.have.lengthOf(1);
  });

  it('should mount registerDelegate with appropriate properties', () => {
    const props = wrapper.find('RegisterDelegate').props();
    expect(typeof props.closeDialog).to.be.equal('function');
  });
});
