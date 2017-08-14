import React from 'react';
import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import Toaster from './';
import store from '../../store';

chai.use(sinonChai);

describe('Toaster', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(<Provider store={store}><Toaster /></Provider>);
  });

  it('should render ToasterComponent', () => {
    expect(wrapper.find('ToasterComponent')).to.have.lengthOf(1);
  });
});
