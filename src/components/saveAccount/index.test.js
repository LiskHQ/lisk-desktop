import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import sinon from 'sinon';
import * as toasterActions from '../../actions/toaster';
import SaveAccountHOC from './index';
import store from '../../store';


describe('SaveAccountHOC', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(<Provider store={store}><SaveAccountHOC /></Provider>);
  });

  it('should render SaveAccount', () => {
    expect(wrapper.find('SaveAccount')).to.have.lengthOf(1);
  });

  it('should bind dialogDisplayed action to SaveAccount props.successToast', () => {
    const actionsSpy = sinon.spy(toasterActions, 'successToastDisplayed');
    wrapper.find('SaveAccount').props().successToast({});
    expect(actionsSpy).to.be.calledWith();
    actionsSpy.restore();
  });
});

