import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import sinon from 'sinon';
import i18n from '../../i18n';
import * as toasterActions from '../../actions/toaster';
import store from '../../store';
import EncryptMessageHOC from './index';
import EncryptMessage from './encryptMessage';

describe('EncryptMessageHOC', () => {
  let props;
  let wrapper;

  beforeEach(() => {
    wrapper = mount(<Provider store={store}><EncryptMessageHOC i18n={i18n}/></Provider>);
    props = wrapper.find(EncryptMessage).props();
  });

  it('should render the encryptMessage with props.successToast and props.copyToClipboard and props.errorToast', () => {
    expect(wrapper.find(EncryptMessage).exists()).to.equal(true);
    expect(typeof wrapper.find(EncryptMessage).props().successToast).to.equal('function');
    expect(typeof wrapper.find(EncryptMessage).props().copyToClipboard).to.equal('function');
  });

  it('should bind successToastDisplayed action to EncryptMessageComponent props.successToast', () => {
    const actionsSpy = sinon.spy(toasterActions, 'successToastDisplayed');
    props.successToast({});
    expect(actionsSpy).to.be.calledWith();
    actionsSpy.restore();
  });

  it('should bind errorToastDisplayed action to EncryptMessageComponent props.errorToast', () => {
    const actionsSpy = sinon.spy(toasterActions, 'errorToastDisplayed');
    props.errorToast({});
    expect(actionsSpy).to.be.calledWith();
    actionsSpy.restore();
  });
});
