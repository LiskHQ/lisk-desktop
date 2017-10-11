import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import sinon from 'sinon';
import i18n from '../../i18n';
import * as toasterActions from '../../actions/toaster';
import store from '../../store';
import DecryptMessageHOC from './index';
import DecryptMessage from './decryptMessage';

describe('DecryptMessageHOC', () => {
  let props;
  let wrapper;

  beforeEach(() => {
    wrapper = mount(<Provider store={store}><DecryptMessageHOC i18n={i18n}/></Provider>);
    props = wrapper.find(DecryptMessage).props();
  });

  it('should render the decryptMessage with props.successToast and props.copyToClipboard and props.errorToast', () => {
    expect(wrapper.find(DecryptMessage).exists()).to.equal(true);
    expect(typeof wrapper.find(DecryptMessage).props().successToast).to.equal('function');
    expect(typeof wrapper.find(DecryptMessage).props().copyToClipboard).to.equal('function');
  });

  it('should bind successToastDisplayed action to DecryptMessageComponent props.successToast', () => {
    const actionsSpy = sinon.spy(toasterActions, 'successToastDisplayed');
    props.successToast({});
    expect(actionsSpy).to.be.calledWith();
    actionsSpy.restore();
  });

  it('should bind errorToastDisplayed action to DecryptMessageComponent props.errorToast', () => {
    const actionsSpy = sinon.spy(toasterActions, 'errorToastDisplayed');
    props.errorToast({});
    expect(actionsSpy).to.be.calledWith();
    actionsSpy.restore();
  });
});
