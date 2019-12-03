import React from 'react';
import { mount } from 'enzyme';
import VerifyMessage from './verifyMessage';
import routes from '../../../constants/routes';

describe('VerifyMessage Component', () => {
  const props = {
    history: {
      location: { search: '?message=Hello&publicKey=c094ebee7ec0c50ebee32918655e089f6e1a604b83bcaa760293c61e0f18ab6f&signature=c68adc131' },
      goBack: jest.fn(),
      push: jest.fn(),
    },
    t: v => v,
  };
  const message = 'Hello world';
  const publicKey = 'c094ebee7ec0c50ebee32918655e089f6e1a604b83bcaa760293c61e0f18ab6f';
  const signature = 'c68adc13131696c35ac82b9bb6884ee4de66ff281b013fe4ded66a73243c860b6a74b759bfb8d25db507ea2bec4bb208f8bb514fa18380416e637db947f0ab06';
  const signedMessage = `-----MESSAGE-----
${message}
-----PUBLIC KEY-----
${publicKey}
-----SIGNATURE-----
${signature}
-----END LISK SIGNED MESSAGE-----
`;

  it('should render properly', () => {
    const wrapper = mount(<VerifyMessage {...props} />);
    expect(wrapper).toContainExactlyOneMatchingElement('MultiStep');
    wrapper.find('img.inputs-view-icon').simulate('click');
    expect(wrapper).toContainExactlyOneMatchingElement('.message input');
    expect(wrapper).toContainExactlyOneMatchingElement('.publicKey input');
    expect(wrapper).toContainExactlyOneMatchingElement('.signature input');
  });

  it('should allow to go forward and back', () => {
    const wrapper = mount(<VerifyMessage {...props} />);
    wrapper.find('img.inputs-view-icon').simulate('click');
    wrapper.find('.continue button').simulate('click');
    expect(wrapper).toContainExactlyOneMatchingElement('.go-to-dashboard button');
    wrapper.find('.go-back button').simulate('click');
    wrapper.find('img.inputs-view-icon').simulate('click');
    expect(wrapper).toContainExactlyOneMatchingElement('.continue button');
    wrapper.find('.continue button').simulate('click');
    expect(wrapper).toContainExactlyOneMatchingElement('.go-to-dashboard button');
    wrapper.find('.go-to-dashboard button').simulate('click');
    expect(props.history.push).toHaveBeenCalledWith(routes.dashboard.path);
  });

  it('should allow to verify valid inputs', () => {
    const wrapper = mount(<VerifyMessage {...props} />);
    wrapper.find('img.inputs-view-icon').simulate('click');
    wrapper.find('.message input').simulate('change', { target: { value: message, name: 'message' } });
    wrapper.find('.publicKey input').simulate('change', { target: { value: publicKey, name: 'publicKey' } });
    wrapper.find('.signature input').simulate('change', { target: { value: signature, name: 'signature' } });
    wrapper.find('.continue button').simulate('click');
    expect(wrapper.find('h1')).toIncludeText('The signature is correct');
  });

  it('should allow to go back and keep value of all inputs', () => {
    const wrapper = mount(<VerifyMessage {...props} />);
    wrapper.find('img.inputs-view-icon').simulate('click');
    wrapper.find('.message input').simulate('change', { target: { value: message, name: 'message' } });
    wrapper.find('.publicKey input').simulate('change', { target: { value: publicKey, name: 'publicKey' } });
    wrapper.find('.signature input').simulate('change', { target: { value: signature, name: 'signature' } });
    wrapper.find('.continue button').simulate('click');
    expect(wrapper.find('h1')).toIncludeText('The signature is correct');
    wrapper.find('.go-back button').simulate('click');
    wrapper.find('img.inputs-view-icon').simulate('click');
    expect(wrapper.find('.message input')).toHaveProp('value', message);
    expect(wrapper.find('.publicKey input')).toHaveProp('value', publicKey);
    expect(wrapper.find('.signature input')).toHaveProp('value', signature);
  });

  it('should allow to verify invalid inputs', () => {
    const wrapper = mount(<VerifyMessage {...props} />);
    wrapper.find('img.inputs-view-icon').simulate('click');
    wrapper.find('.message input').simulate('change', { target: { value: message, name: 'message' } });
    wrapper.find('.publicKey input').simulate('change', { target: { value: publicKey, name: 'publicKey' } });
    wrapper.find('.signature input').simulate('change', { target: { value: signature.substr(2), name: 'signature' } });
    wrapper.find('.continue button').simulate('click');
    expect(wrapper.find('h1')).toIncludeText('The signature is incorrect');
  });

  it('should recognize invalid publicKey', () => {
    const wrapper = mount(<VerifyMessage {...props} />);
    wrapper.find('img.inputs-view-icon').simulate('click');
    wrapper.find('.publicKey input').simulate('change', { target: { value: publicKey.substr(1), name: 'publicKey' } });
    expect(wrapper.find('.publicKey .feedback').first()).toIncludeText('not a valid public key');
  });

  it('should allow to switch to textarea view and back', () => {
    const wrapper = mount(<VerifyMessage {...props} />);
    expect(wrapper).toContainMatchingElement('.signedMessage');
    wrapper.find('img.inputs-view-icon').simulate('click');
    expect(wrapper).not.toContainMatchingElement('.signedMessage');
    wrapper.find('img.textarea-view-icon').simulate('click');
    expect(wrapper).toContainMatchingElement('.signedMessage');
  });

  it('should allow to verify a valid message with the textarea view', () => {
    const wrapper = mount(<VerifyMessage {...props} />);
    wrapper.find('.signedMessage textarea').simulate('change', { target: { value: signedMessage, name: 'signedMessage' } });

    wrapper.find('.continue button').simulate('click');
    expect(wrapper.find('h1')).toIncludeText('The signature is correct');
  });

  it('should allow to verify a invalid message with the textarea view', () => {
    const wrapper = mount(<VerifyMessage {...props} />);
    wrapper.find('.signedMessage textarea').simulate('change', { target: { value: signedMessage.substring(10), name: 'signedMessage' } });

    wrapper.find('.continue button').simulate('click');
    expect(wrapper.find('h1')).toIncludeText('The signature is incorrect');
  });
});
