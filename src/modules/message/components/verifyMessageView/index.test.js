import { mountWithRouter } from 'src/utils/testHelpers';
import accounts from '@tests/constants/wallets';
import VerifyMessage from './index';

describe('VerifyMessage Component', () => {
  let wrapper;
  const props = {
    history: {
      location: {
        search: `?message=Hello&publicKey=${accounts.genesis.summary.publicKey}&signature=c68adc131`,
      },
      goBack: jest.fn(),
      push: jest.fn(),
    },
    t: (v) => v,
  };
  const message = 'Hello world';
  const publicKey = accounts.genesis.summary.publicKey;
  const signature =
    '2240598a4d7700010d82a60b066c5daf1f45fe673dbbd0e4b368ac8d07f78710e7685a598395784066f2e474db8095b7cb2ba503bcc3f1bb06c528cf048fc201';
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

  it('should allow to go back and keep value of all inputs', () => {
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
