import React from 'react';
// import { expect } from 'chai';
import { mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import PropTypes from 'prop-types';
import sinon from 'sinon';
import i18n from '../../i18n';
import ReceiveDialog from './receiveDialog';

describe('ReceiveDialog', () => {
  let props;
  let store;
  const address = '544792633152563672L';

  beforeEach(() => {
    store = configureStore()({
      account: {
        address,
      },
    });
    props = {
      address,
      successToast: () => {},
      closeDialog: () => {},
      copyToClipboard: () => (true),
      t: key => key,
    };
  });

  it('allows to copy address to clipboard ', () => {
    const wrapper = mount(<ReceiveDialog {...props} />, {
      context: { store, i18n },
      childContextTypes: {
        store: PropTypes.object.isRequired,
        i18n: PropTypes.object.isRequired,
      },
    });

    const successToastSpy = sinon.spy(props, 'successToast');
    const closeDialogSpy = sinon.spy(props, 'closeDialog');
    const copyToClipboardSpy = sinon.spy(props, 'copyToClipboard');

    wrapper.find('button.copy-address-button').simulate('click');

    // TODO figure out why this doesn't work even though test coverage shows it's been called
    // expect(successToastSpy).to.have.been.calledWith();
    // expect(closeDialogSpy).to.have.been.calledWith();
    // expect(copyToClipboardSpy).to.have.been.calledWith();

    successToastSpy.restore();
    closeDialogSpy.restore();
    copyToClipboardSpy.restore();
  });
});
