import React from 'react';
import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import Toaster from './toaster';
import ToasterHOC from './index';
import store from '../../store';

chai.use(sinonChai);

describe('ToasterHOC', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(<Provider store={store}><ToasterHOC /></Provider>);
  });

  it('should render Toaster', () => {
    expect(wrapper.find(Toaster)).to.have.lengthOf(1);
  });
});
