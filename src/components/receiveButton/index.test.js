import { Provider } from 'react-redux';
import React from 'react';
import copy from 'copy-to-clipboard';

import { expect } from 'chai';
import { mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import sinon from 'sinon';

import ReceiveButtonHOC from './index';
import * as dialogActions from '../../actions/dialog';
import * as toasterActions from '../../actions/toaster';

const fakeStore = configureStore();

describe('ReceiveButtonHOC', () => {
  let wrapper;
  const address = '544792633152563672L';

  beforeEach(() => {
    const store = fakeStore({
      account: {
        address,
      },
    });
    wrapper = mount(<Provider store={store}><ReceiveButtonHOC /></Provider>);
  });

  it('should render ReceiveButton with address', () => {
    expect(wrapper.find('ReceiveButton')).to.have.lengthOf(1);
    expect(wrapper.find('ReceiveButton').props().address).to.equal(address);
  });

  it('should bind dialogDisplayed action to ReceiveButton props.setActiveDialog', () => {
    const actionsSpy = sinon.spy(dialogActions, 'dialogDisplayed');
    wrapper.find('ReceiveButton').props().setActiveDialog({});
    expect(actionsSpy).to.be.calledWith();
    actionsSpy.restore();
  });

  it('should bind successToastDisplayed action to ReceiveButton props.successToast', () => {
    const actionsSpy = sinon.spy(toasterActions, 'successToastDisplayed');
    wrapper.find('ReceiveButton').props().successToast({});
    expect(actionsSpy).to.be.calledWith();
    actionsSpy.restore();
  });

  // TODO: this doesn't work for some reason
  it.skip('should bind copy to AccountComponent props.copyToClipboard', () => {
    const actionsSpy = sinon.spy(copy);
    wrapper.find('ReceiveButton').props().copyToClipboard({});
    expect(actionsSpy).to.be.calledWith();
    actionsSpy.restore();
  });
});
