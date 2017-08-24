import React from 'react';
import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import Toaster from './toaster';
import ToasterContainer from './index';
import store from '../../store';

chai.use(sinonChai);

describe('ToasterContainer', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(<Provider store={store}><ToasterContainer /></Provider>);
  });

  it('should render Toaster', () => {
    expect(wrapper.find(Toaster)).to.have.lengthOf(1);
  });
});
