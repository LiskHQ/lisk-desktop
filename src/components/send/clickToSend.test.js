import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import sinon from 'sinon';
import * as dialogActions from '../../actions/dialog';
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

  it('should bind dialogDisplayed action to ClickToSendComponent props.setActiveDialog', () => {
    const actionsSpy = sinon.spy(dialogActions, 'dialogDisplayed');
    wrapper.find('ClickToSendComponent').props().setActiveDialog({});
    expect(actionsSpy).to.be.calledWith();
    actionsSpy.restore();
  });
});
