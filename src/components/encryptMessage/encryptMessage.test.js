import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import Lisk from 'lisk-js';
import i18n from '../../i18n';
import store from '../../store';
import EncryptMessage from './encryptMessage';


describe('EncryptMessage', () => {
  let wrapper;
  let successToastSpy;
  let copyMock;
  let encryptMessageSpy;
  const recipientPublicKey = '164a0580cd2b430bc3496f82adf51b799546a3a4658bb9dca550a0e20cb579c8';
  const message = 'Hello world';
  const publicKey = '164a0580cd2b430bc3496f82adf51b799546a3a4658bb9dca550a0e20cb579c8';
  const account = {
    passphrase: 'wagon stock borrow episode laundry kitten salute link globe zero feed marble',
    publicKey,
  };

  beforeEach(() => {
    successToastSpy = sinon.spy();
    copyMock = sinon.mock();
    encryptMessageSpy = sinon.spy(Lisk.crypto, 'encryptMessageWithSecret');
    const props = {
      account,
      successToast: successToastSpy,
      copyToClipboard: copyMock,
      t: key => key,
    };

    wrapper = mount(<Provider store={store}>
      <I18nextProvider i18n={ i18n }>
        <EncryptMessage {...props} />
      </I18nextProvider>
    </Provider>);
  });

  afterEach(() => {
    encryptMessageSpy.restore();
  });

  it('allows to encrypt a message, copies encrypted message result to clipboard and shows success toast', () => {
    copyMock.returns(true);
    wrapper.find('.message textarea').simulate('change', { target: { value: message } });
    wrapper.find('.recipientPublicKey input').simulate('change', { target: { value: recipientPublicKey } });
    wrapper.find('form').simulate('submit');
    expect(encryptMessageSpy).to.have.been
      .calledWith(message, account.passphrase, recipientPublicKey);
    expect(successToastSpy).to.have.been.calledWith({ label: 'Result copied to clipboard' });
  });

  it('does not show success toast if copy-to-clipboard failed', () => {
    copyMock.returns(false);
    wrapper.find('.message textarea').simulate('change', { target: { value: message } });
    wrapper.find('.recipientPublicKey input').simulate('change', { target: { value: recipientPublicKey } });
    wrapper.find('.primary-button').simulate('click');
    expect(successToastSpy).to.have.not.been.calledWith();
  });
});
