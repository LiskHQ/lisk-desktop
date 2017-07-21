import React from 'react';
import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import Forging from './';
import store from '../../store';

chai.use(sinonChai);


describe('Forging', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(<Provider store={store}><Forging /></Provider>);
  });

  it('should render ForgingComponent', () => {
    expect(wrapper.find('ForgingComponent')).to.have.lengthOf(1);
  });
});
