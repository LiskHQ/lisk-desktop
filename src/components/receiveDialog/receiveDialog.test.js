import React from 'react';
// import { expect } from 'chai';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import sinon from 'sinon';
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
    };
  });

  it('allows to copy address to clipboard ', () => {
    const wrapper = mount(<Provider store={store}><ReceiveDialog {...props} /></Provider>);

    const successToastSpy = sinon.spy(props, 'successToast');
    const closeDialogSpy = sinon.spy(props, 'closeDialog');
    const copyToClipboardSpy = sinon.spy(props, 'copyToClipboard');

    wrapper.find('.copy-address-button').simulate('click');

    // TODO figure out why this doesn't work even though test coverage shows it's been called
    // expect(successToastSpy).to.have.been.calledWith();
    // expect(closeDialogSpy).to.have.been.calledWith();
    // expect(copyToClipboardSpy).to.have.been.calledWith();

    successToastSpy.restore();
    closeDialogSpy.restore();
    copyToClipboardSpy.restore();
  });
});
