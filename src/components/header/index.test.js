import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import sinon from 'sinon';
import * as accountActions from '../../actions/account';
import * as dialogActions from '../../actions/dialog';
import Header from './index';
import store from '../../store';


describe('Header', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(<Provider store={store}><Header /></Provider>);
  });

  it('should render HeaderElement', () => {
    expect(wrapper.find('HeaderElement')).to.have.lengthOf(1);
  });

  it('should bind accountLoggedOut action to HeaderElement props.logOut', () => {
    const actionsSpy = sinon.spy(accountActions, 'accountLoggedOut');
    wrapper.find('HeaderElement').props().logOut({});
    expect(actionsSpy).to.be.calledWith();
    actionsSpy.restore();
  });

  it('should bind dialogDisplayed action to HeaderElement props.setActiveDialog', () => {
    const actionsSpy = sinon.spy(dialogActions, 'dialogDisplayed');
    wrapper.find('HeaderElement').props().setActiveDialog({});
    expect(actionsSpy).to.be.calledWith();
    actionsSpy.restore();
  });
});


