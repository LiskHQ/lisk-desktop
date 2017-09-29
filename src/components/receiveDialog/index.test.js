import React from 'react';
import copy from 'copy-to-clipboard';
import { BrowserRouter as Router } from 'react-router-dom';
import { expect } from 'chai';
import { mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import PropTypes from 'prop-types';
import sinon from 'sinon';
import i18n from '../../i18n';
import ReceiveDialogHOC from './index';
import * as dialogActions from '../../actions/dialog';
import * as toasterActions from '../../actions/toaster';

const fakeStore = configureStore();

describe('ReceiveDialogHOC', () => {
  let wrapper;
  const address = '544792633152563672L';

  beforeEach(() => {
    const store = fakeStore({
      account: {
        address,
      },
    });
    wrapper = mount(<Router><ReceiveDialogHOC /></Router>, {
      context: { store, i18n },
      childContextTypes: {
        store: PropTypes.object.isRequired,
        i18n: PropTypes.object.isRequired,
      },
    });
  });

  it('should render ReceiveButton with address', () => {
    expect(wrapper.find('ReceiveDialog')).to.have.lengthOf(1);
    expect(wrapper.find('ReceiveDialog').props().address).to.equal(address);
  });

  it('should bind dialogDisplayed action to ReceiveButton props.setActiveDialog', () => {
    const actionsSpy = sinon.spy(dialogActions, 'dialogDisplayed');
    wrapper.find('ReceiveDialog').props().setActiveDialog({});
    expect(actionsSpy).to.be.calledWith();
    actionsSpy.restore();
  });

  it('should bind successToastDisplayed action to ReceiveButton props.successToast', () => {
    const actionsSpy = sinon.spy(toasterActions, 'successToastDisplayed');
    wrapper.find('ReceiveDialog').props().successToast({});
    expect(actionsSpy).to.be.calledWith();
    actionsSpy.restore();
  });

  // TODO: this doesn't work for some reason
  it.skip('should bind copy to AccountComponent props.copyToClipboard', () => {
    const actionsSpy = sinon.spy(copy);
    wrapper.find('ReceiveDialog').props().copyToClipboard({});
    expect(actionsSpy).to.be.calledWith();
    actionsSpy.restore();
  });
});
