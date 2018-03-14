import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import Toaster from './toaster';
import ToasterHOC from './index';
import store from '../../store';

/* eslint-disable mocha/no-exclusive-tests */
describe.only('ToasterHOC', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(<Provider store={store}><ToasterHOC /></Provider>);
  });

  it('should render Toaster', () => {
    expect(wrapper.find(Toaster)).to.have.lengthOf(1);
  });
});
/* eslint-enable mocha/no-exclusive-tests */
