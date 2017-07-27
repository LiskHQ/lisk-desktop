import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import SendContainer from './';
import store from '../../store';


describe('Send Container', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(<Provider store={store}><SendContainer /></Provider>);
  });

  it('should render Send', () => {
    expect(wrapper.find('Send')).to.have.lengthOf(1);
  });
});
