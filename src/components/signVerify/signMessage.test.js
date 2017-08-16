import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import copy from 'copy-to-clipboard';
import sinon from 'sinon';
import * as toasterActions from '../../actions/toaster';
import store from '../../store';
import SignMessage from './signMessage';
import SignMessageComponent from './signMessageComponent';

describe('SignMessage', () => {
  let props;
  let wrapper;

  beforeEach(() => {
    wrapper = mount(<Provider store={store}><SignMessage /></Provider>);
    props = wrapper.find(SignMessageComponent).props();
  });

  it('should render the SignMessageComponent with props.successToast and props.copyToClipboard', () => {
    expect(wrapper.find(SignMessageComponent).exists()).to.equal(true);
    expect(typeof wrapper.find(SignMessageComponent).props().successToast).to.equal('function');
    expect(typeof wrapper.find(SignMessageComponent).props().copyToClipboard).to.equal('function');
  });

  it('should bind successToastDisplayed action to AccountComponent props.successToast', () => {
    const actionsSpy = sinon.spy(toasterActions, 'successToastDisplayed');
    props.successToast({});
    expect(actionsSpy).to.be.calledWith();
    actionsSpy.restore();
  });

  // TODO: this doesn't work for some reason
  it.skip('should bind copy to AccountComponent props.copyToClipboard', () => {
    const actionsSpy = sinon.spy(copy);
    props.copyToClipboard({});
    expect(actionsSpy).to.be.calledWith();
    actionsSpy.restore();
  });
});
