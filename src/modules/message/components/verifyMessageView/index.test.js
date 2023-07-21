import { cryptography } from '@liskhq/lisk-client';
import { mountWithRouter } from 'src/utils/testHelpers';
import VerifyMessage from './index';

describe('VerifyMessage Component', () => {
  let wrapper;
  const publicKey = 'cfb08903c2fc487fcd8785b4db6532e05cdf7b2c16669e6140b79bcb837d7298';
  const props = {
    history: {
      location: {
        search: `?message=Hello&publicKey=${publicKey}&signature=c68adc131`,
      },
      goBack: jest.fn(),
      push: jest.fn(),
    },
    t: (v) => v,
  };
  const message = 'Hello world';
  const signature =
    '41667f16421452e721245519579b2c2d87085df787721ccd88de81b7713f305172895e9427b0c1b7fec212af52eb87507b4996b639abb19482ce00be9cadc505';
  const signedMessage = `-----MESSAGE-----
${message}
-----PUBLIC KEY-----
${publicKey}
-----SIGNATURE-----
${signature}
-----END LISK SIGNED MESSAGE-----
`;

  beforeEach(() => {
    wrapper = mountWithRouter(VerifyMessage, props, { pathname: '/wallet' });
  });

  it('should render properly', () => {
    expect(wrapper).toContainExactlyOneMatchingElement('MultiStep');
    wrapper.find('img.inputs-view-icon').simulate('click');
    expect(wrapper).toContainExactlyOneMatchingElement('.message input');
    expect(wrapper).toContainExactlyOneMatchingElement('.publicKey input');
    expect(wrapper).toContainExactlyOneMatchingElement('.signature input');
  });

  it('should allow to go forward and back', () => {
    wrapper.find('img.inputs-view-icon').simulate('click');
    expect(wrapper).toContainExactlyOneMatchingElement('.continue button');
    wrapper.find('.continue button').simulate('click');
    expect(wrapper).toContainExactlyOneMatchingElement('.go-back button');
    wrapper.find('.go-back button').simulate('click');
    expect(props.history.push).toHaveBeenCalledWith('/wallet');
  });

  it('should allow to verify valid inputs', () => {
    jest.spyOn(cryptography.ed, 'verifyMessageWithPublicKey').mockReturnValueOnce(true);

    wrapper.find('img.inputs-view-icon').simulate('click');
    wrapper
      .find('.message input')
      .simulate('change', { target: { value: message, name: 'message' } });
    wrapper
      .find('.publicKey input')
      .simulate('change', { target: { value: publicKey, name: 'publicKey' } });
    wrapper
      .find('.signature input')
      .simulate('change', { target: { value: signature, name: 'signature' } });
    wrapper.find('.continue button').simulate('click');
    expect(wrapper.find('h1')).toIncludeText('Signature is correct');
  });

  it('should allow to verify invalid inputs', () => {
    wrapper.find('img.inputs-view-icon').simulate('click');
    wrapper
      .find('.message input')
      .simulate('change', { target: { value: message, name: 'message' } });
    wrapper
      .find('.publicKey input')
      .simulate('change', { target: { value: publicKey, name: 'publicKey' } });
    wrapper
      .find('.signature input')
      .simulate('change', { target: { value: signature.substr(2), name: 'signature' } });
    wrapper.find('.continue button').simulate('click');
    expect(wrapper.find('h1')).toIncludeText('Signature is incorrect');
  });

  it('should recognize invalid publicKey', () => {
    wrapper.find('img.inputs-view-icon').simulate('click');
    wrapper
      .find('.publicKey input')
      .simulate('change', { target: { value: publicKey.substr(1), name: 'publicKey' } });
    expect(wrapper.find('.publicKey .feedback').first()).toIncludeText('not a valid public key');
  });

  it('should allow to switch to textarea view and back', () => {
    expect(wrapper).toContainMatchingElement('.signedMessage');
    wrapper.find('img.inputs-view-icon').simulate('click');
    expect(wrapper).not.toContainMatchingElement('.signedMessage');
    wrapper.find('img.textarea-view-icon').simulate('click');
    expect(wrapper).toContainMatchingElement('.signedMessage');
  });

  it('should allow to verify a valid message with the textarea view', () => {
    jest.spyOn(cryptography.ed, 'verifyMessageWithPublicKey').mockReturnValueOnce(true);
    wrapper
      .find('.signedMessage textarea')
      .simulate('change', { target: { value: signedMessage, name: 'signedMessage' } });

    wrapper.find('.continue button').simulate('click');
    expect(wrapper.find('h1')).toIncludeText('Signature is correct');
  });

  it('should allow to verify a invalid message with the textarea view', () => {
    wrapper.find('.signedMessage textarea').simulate('change', {
      target: { value: signedMessage.substring(10), name: 'signedMessage' },
    });

    wrapper.find('.continue button').simulate('click');
    expect(wrapper.find('h1')).toIncludeText('Signature is incorrect');
  });
});
