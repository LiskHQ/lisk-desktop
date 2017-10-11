import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import Lisk from 'lisk-js';
import i18n from '../../i18n';
import store from '../../store';
import DecryptMessage from './decryptMessage';


describe('DecryptMessage', () => {
  let wrapper;
  let successToastSpy;
  let errorSpy;
  let copyMock;
  let decryptMessageMock;
  const senderPublicKey = '164a0580cd2b430bc3496f82adf51b799546a3a4658bb9dca550a0e20cb579c8';
  const message = 'Hello world';
  const decryptedMessage = 'Decrypted Hello world';
  const nonce = 'this is nonce';
  const publicKey = '164a0580cd2b430bc3496f82adf51b799546a3a4658bb9dca550a0e20cb579c8';
  const account = {
    passphrase: 'wagon stock borrow episode laundry kitten salute link globe zero feed marble',
    publicKey,
  };

  beforeEach(() => {
    successToastSpy = sinon.spy();
    errorSpy = sinon.spy();
    copyMock = sinon.mock();
    decryptMessageMock = sinon.stub(Lisk.crypto, 'decryptMessageWithSecret');
    // decryptMessageSpy = sinon.spy(Lisk.crypto, 'decryptMessageWithSecret');
    const props = {
      account,
      successToast: successToastSpy,
      errorToast: sinon.spy(),
      copyToClipboard: copyMock,
      t: key => key,
    };

    wrapper = mount(<Provider store={store}>
      <I18nextProvider i18n={ i18n }>
        <DecryptMessage {...props} />
      </I18nextProvider>
    </Provider>);
  });

  afterEach(() => {
    decryptMessageMock.restore();
  });

  // ToDo find the problem with this test
  it.skip('shows error toast when couldn\'t decrypt a message', () => {
    decryptMessageMock.returnsPromise().rejects({ message: 'couldn\'t decrypt the message' });
    wrapper.find('.message textarea').simulate('change', { target: { value: message } });
    wrapper.find('.senderPublicKey input').simulate('change', { target: { value: senderPublicKey } });
    wrapper.find('.nonce input').simulate('change', { target: { value: nonce } });
    wrapper.find('form').simulate('submit');
    expect(errorSpy).to.have.been.calledOnce();
    expect(errorSpy).to.have.been.calledWith({ label: 'couldn\'t decrypt the message' });
  });

  it('allows to decrypt a message, copies encrypted message result to clipboard and shows success toast', () => {
    copyMock.returns(true);
    decryptMessageMock.returnsPromise().resolves(decryptedMessage);
    wrapper.find('.message textarea').simulate('change', { target: { value: message } });
    wrapper.find('.senderPublicKey input').simulate('change', { target: { value: senderPublicKey } });
    wrapper.find('.nonce input').simulate('change', { target: { value: nonce } });
    wrapper.find('form').simulate('submit');
    expect(successToastSpy).to.have.been.calledWith({ label: 'Message is decrypted successfully' });
  });

  it('does not show success toast if copy-to-clipboard failed', () => {
    copyMock.returns(false);
    wrapper.find('.message textarea').simulate('change', { target: { value: message } });
    wrapper.find('.senderPublicKey input').simulate('change', { target: { value: senderPublicKey } });
    wrapper.find('.nonce input').simulate('change', { target: { value: nonce } });
    wrapper.find('.primary-button').simulate('click');
    expect(successToastSpy).to.have.not.been.calledWith();
  });
});
