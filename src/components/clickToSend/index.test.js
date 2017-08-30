import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import sinon from 'sinon';
import * as dialogActions from '../../actions/dialog';
import ClickToSendHOC from './index';
import store from '../../store';


describe('ClickToSendHOC', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(<Provider store={store}><ClickToSendHOC /></Provider>);
  });

  it('should render ClickToSend', () => {
    expect(wrapper.find('ClickToSend')).to.have.lengthOf(1);
  });

  it('should bind dialogDisplayed action to ClickToSend props.setActiveDialog', () => {
    const actionsSpy = sinon.spy(dialogActions, 'dialogDisplayed');
    wrapper.find('ClickToSend').props().setActiveDialog({});
    expect(actionsSpy).to.be.calledWith();
    actionsSpy.restore();
  });
});
