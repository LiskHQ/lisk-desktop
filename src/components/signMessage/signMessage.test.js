import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import sinon from 'sinon';
import PropTypes from 'prop-types';
import i18n from '../../i18n';
import SignMessage from './signMessage';


describe('SignMessage', () => {
  let wrapper;
  let successToastSpy;
  let copyMock;
  let props;
  let store;
  let options;
  const publicKey = 'c094ebee7ec0c50ebee32918655e089f6e1a604b83bcaa760293c61e0f18ab6f';
  const signature1 = '079331d868678fd5f272f09d6dc8792fb21335aec42af7f11caadbfbc17d4707e7' +
    'd7f343854b0c619b647b81ba3f29b23edb4eaf382a47c534746bad4529560b48656c6c6f20776f726c64';
  const signature2 = '40f339db0d00f7909ab3818a1181e1fcb4139c9cb092c56aa88108b821eb6769bb' +
    '970a99edf2ec60729612fb04a4470cc190786fcb5142b72a6b2a0100e7f90148656c6c6f203220776f726c6473';
  const message1 = 'Hello world';
  const message2 = 'Hello 2 worlds';
  const account = {
    passphrase: 'wagon stock borrow episode laundry kitten salute link globe zero feed marble',
    publicKey,
  };
  const getResult = (message, signature) => (`-----BEGIN LISK SIGNED MESSAGE-----
-----MESSAGE-----
${message}
-----PUBLIC KEY-----
${publicKey}
-----SIGNATURE-----
${signature}
-----END LISK SIGNED MESSAGE-----`);

  beforeEach(() => {
    successToastSpy = sinon.spy();
    copyMock = sinon.mock();
    props = {
      account,
      successToast: successToastSpy,
      copyToClipboard: copyMock,
      t: key => key,
    };
    store = configureMockStore([])({
      account,
    });
    options = {
      context: { store, i18n },
      childContextTypes: {
        store: PropTypes.object.isRequired,
        i18n: PropTypes.object.isRequired,
      },
    };

    wrapper = mount(<SignMessage {...props} />, options);
  });

  it('allows to sign a message, copies sign message result to clipboard and shows success toast', () => {
    copyMock.returns(true);
    wrapper.find('.message textarea').simulate('change', { target: { value: message1 } });
    wrapper.find('#signMessageForm').simulate('submit');
    expect(wrapper.find('.result Input').text()).to.equal(getResult(message1, signature1));
    expect(successToastSpy).to.have.been.calledWith({ label: 'Result copied to clipboard' });
  });

  it('allows to sign multiple messages, shows the signed message and success toast each time', () => {
    copyMock.returns(true);
    wrapper.find('.message textarea').simulate('change', { target: { value: message1 } });
    wrapper.find('#signMessageForm').simulate('submit');
    expect(wrapper.find('.result Input').text()).to.equal(getResult(message1, signature1));
    expect(successToastSpy).to.have.been.calledWith({ label: 'Result copied to clipboard' });

    copyMock.reset();
    copyMock.returns(true);
    wrapper.find('.message textarea').simulate('change', { target: { value: message2 } });
    wrapper.find('#signMessageForm').simulate('submit');
    expect(wrapper.find('.result Input').text()).to.equal(getResult(message2, signature2));
    expect(successToastSpy).to.have.been.calledWith({ label: 'Result copied to clipboard' });
  });

  it('allows to sign a message with a locked account', () => {
    copyMock.returns(true);

    store = configureMockStore([])({
      account: {
        ...account,
        passphrase: undefined,
      },
    });

    wrapper = mount(<SignMessage {...props} />, {
      ...options,
      context: { store, i18n },
    });

    wrapper.setProps({
      ...props,
      account: {
        ...account,
        passphrase: undefined,
      },
    });

    wrapper.find('.message textarea').simulate('change', { target: { value: message1 } });
    wrapper.find('.passphrase input').simulate('change', { target: { value: account.passphrase } });
    wrapper.find('#signMessageForm').simulate('submit');
    expect(wrapper.find('.result Input').text()).to.equal(getResult(message1, signature1));
  });

  it('does not show success toast if copy-to-clipboard failed', () => {
    copyMock.returns(false);
    wrapper.find('.message textarea').simulate('change', { target: { value: message1 } });
    wrapper.find('#signMessageForm').simulate('submit');
    expect(successToastSpy).to.have.not.been.calledWith();
  });
});
