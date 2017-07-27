import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';
import SignMessageComponent from './signMessageComponent';

describe('SignMessageComponent', () => {
  let wrapper;
  let successToastSpy;
  const publicKey = 'c094ebee7ec0c50ebee32918655e089f6e1a604b83bcaa760293c61e0f18ab6f';
  const signature = '079331d868678fd5f272f09d6dc8792fb21335aec42af7f11caadbfbc17d4707e7' +
    'd7f343854b0c619b647b81ba3f29b23edb4eaf382a47c534746bad4529560b48656c6c6f20776f726c64';
  const message = 'Hello world';
  const account = {
    passphrase: 'wagon stock borrow episode laundry kitten salute link globe zero feed marble',
    publicKey,
  };
  const result = `-----BEGIN LISK SIGNED MESSAGE-----
-----MESSAGE-----
${message}
-----PUBLIC KEY-----
${publicKey}
-----SIGNATURE-----
${signature}
-----END LISK SIGNED MESSAGE-----`;

  beforeEach(() => {
    successToastSpy = sinon.spy();
    wrapper = mount(<SignMessageComponent account={account} successToast={successToastSpy} />);
  });

  it('allows to sign a message', () => {
    wrapper.find('.message textarea').simulate('change', { target: { value: message } });
    wrapper.find('.sign-button').simulate('click');
    expect(wrapper.find('.result textarea').text()).to.equal(result);
  });
});
