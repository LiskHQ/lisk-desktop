import React from 'react';
import chai, { expect } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import SignMessageComponent from './signMessageComponent';

chai.use(sinonChai);

describe('SignMessageComponent', () => {
  let wrapper;
  let successToastSpy;
  let copyMock;
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
    copyMock = sinon.mock();

    wrapper = mount(<SignMessageComponent
      account={account} successToast={successToastSpy} copyToClipboard={copyMock} />);
  });

  it('allows to sign a message, copies sign mesage result to clipboard and shows success toast', () => {
    copyMock.returns(true);
    wrapper.find('.message textarea').simulate('change', { target: { value: message } });
    wrapper.find('.sign-button').simulate('click');
    expect(wrapper.find('.result textarea').text()).to.equal(result);
    expect(successToastSpy).to.have.been.calledWith({ label: 'Result copied to clipboard' });
  });

  it('does not show success toast if copy-to-clipboard failed', () => {
    copyMock.returns(false);
    wrapper.find('.message textarea').simulate('change', { target: { value: message } });
    wrapper.find('.sign-button').simulate('click');
    expect(successToastSpy).to.have.not.been.calledWith();
  });
});
