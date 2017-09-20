import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import sinon from 'sinon';
import * as toasterActions from '../../actions/toaster';
import * as dialogActions from '../../actions/dialog';
import store from '../../store';
import SaveAccountButtonHOC from './index';
import SaveAccountButton from './saveAccountButton';

describe('SaveAccountButtonHOC', () => {
  let props;
  let wrapper;

  beforeEach(() => {
    wrapper = mount(<Provider store={store}><SaveAccountButtonHOC /></Provider>);
    props = wrapper.find(SaveAccountButton).props();
  });

  it('should render the SaveAccountButton with props.successToast and props.setActiveDialog', () => {
    expect(wrapper.find(SaveAccountButton).exists()).to.equal(true);
    expect(typeof props.successToast).to.equal('function');
    expect(typeof props.setActiveDialog).to.equal('function');
  });

  it('should bind successToastDisplayed action to SaveAccountButton props.successToast', () => {
    const actionsSpy = sinon.spy(toasterActions, 'successToastDisplayed');
    props.successToast({});
    expect(actionsSpy).to.be.calledWith();
    actionsSpy.restore();
  });

  it('should bind dialogDisplayed action to SaveAccountButton props.setActiveDialog', () => {
    const actionsSpy = sinon.spy(dialogActions, 'dialogDisplayed');
    props.setActiveDialog({});
    expect(actionsSpy).to.be.calledWith();
    actionsSpy.restore();
  });
});

