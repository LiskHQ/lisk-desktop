import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import ClickToSend from './clickToSend';
import store from '../../store';


describe('Send Container', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(<Provider store={store}><ClickToSend /></Provider>);
  });

  it('should render ClickToSendComponent', () => {
    expect(wrapper.find('ClickToSendComponent')).to.have.lengthOf(1);
  });
});
