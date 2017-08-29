import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import Toaster from './';
import store from '../../store';


describe('Toaster', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(<Provider store={store}><Toaster /></Provider>);
  });

  it('should render ToasterComponent', () => {
    expect(wrapper.find('ToasterComponent')).to.have.lengthOf(1);
  });
});
