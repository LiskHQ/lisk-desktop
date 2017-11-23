import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';
import PropTypes from 'prop-types';
import Lisk from 'lisk-js';
import i18n from '../../i18n';
import store from '../../store';
import Authenticate from '../authenticate';
import EncryptMessage from './encryptMessage';


describe('EncryptMessage', () => {
  let wrapper;
  let encryptMessageSpy;
  let props;
  const recipientPublicKey = '164a0580cd2b430bc3496f82adf51b799546a3a4658bb9dca550a0e20cb579c8';
  const message = 'Hello world';
  const publicKey = '164a0580cd2b430bc3496f82adf51b799546a3a4658bb9dca550a0e20cb579c8';
  const account = {
    passphrase: 'wagon stock borrow episode laundry kitten salute link globe zero feed marble',
    publicKey,
  };

  beforeEach(() => {
    encryptMessageSpy = sinon.spy(Lisk.crypto, 'encryptMessageWithSecret');
    props = {
      account,
      successToast: sinon.spy(),
      errorToast: sinon.spy(),
      copyToClipboard: sinon.mock(),
      t: key => key,
    };

    const options = {
      context: { store, i18n },
      childContextTypes: {
        store: PropTypes.object.isRequired,
        i18n: PropTypes.object.isRequired,
      },
    };

    wrapper = mount(<EncryptMessage {...props} />, options);
  });

  afterEach(() => {
    encryptMessageSpy.restore();
  });

  it('shows Authenticate step if passphrase is not available', () => {
    wrapper.setProps({
      account: { publicKey },
    });
    expect(wrapper.find(Authenticate)).to.have.length(1);
  });

  it('allows to encrypt a message, copies encrypted message result to clipboard and shows success toast', () => {
    props.copyToClipboard.returns(true);
    wrapper.find('.message textarea').simulate('change', { target: { value: message } });
    wrapper.find('.recipientPublicKey input').simulate('change', { target: { value: recipientPublicKey } });
    wrapper.find('form').simulate('submit');
    expect(encryptMessageSpy).to.have.been
      .calledWith(message, account.passphrase, recipientPublicKey);
    expect(props.successToast).to.have.been.calledWith({ label: 'Result copied to clipboard' });
  });

  it('shows error toast if encryp message failed', () => {
    const invalidPublicKey = 'INVALID';
    props.copyToClipboard.returns(true);
    wrapper.find('.message textarea').simulate('change', { target: { value: message } });
    wrapper.find('.recipientPublicKey input').simulate('change', { target: { value: invalidPublicKey } });
    wrapper.find('form').simulate('submit');
    expect(encryptMessageSpy).to.have.been.calledWith(
      message, account.passphrase, invalidPublicKey);
    expect(props.errorToast).to.have.been.calledWith(
      { label: 'Message encryption failed' });
  });

  it('does not show success toast if copy-to-clipboard failed', () => {
    props.copyToClipboard.returns(false);
    wrapper.find('.message textarea').simulate('change', { target: { value: message } });
    wrapper.find('.recipientPublicKey input').simulate('change', { target: { value: recipientPublicKey } });
    wrapper.find('form').simulate('submit');
    expect(props.successToast).to.have.not.been.calledWith();
  });
});
