import React from 'react';
import Input from 'react-toolbox/lib/input';
import Lisk from 'lisk-js';

import InfoParagraph from '../infoParagraph';
import SignVerifyResult from '../signVerifyResult';
import ActionBar from '../actionBar';


class SignMessageComponent extends React.Component {

  constructor() {
    super();
    this.state = {
      message: '',
      result: '',
    };
  }

  sign(message) {
    const signedMessage = Lisk.crypto.signMessageWithSecret(message,
      this.props.account.passphrase);
    const result = Lisk.crypto.printSignedMessage(
      message, signedMessage, this.props.account.publicKey);
    this.setState({ result, resultIsShown: false, message });
  }

  showResult() {
    const copied = this.props.copyToClipboard(this.state.result, {
      message: 'Press #{key} to copy',
    });
    if (copied) {
      this.props.successToast({ label: 'Result copied to clipboard' });
    }
    this.setState({ resultIsShown: true });
  }

  render() {
    return (
      <div className='sign-message'>
          <InfoParagraph>
              Signing a message with this tool indicates ownership of a privateKey (secret) and
              provides a level of proof that you are the owner of the key.
              Its important to bear in mind that this is not a 100% proof as computer systems
              can be compromised, but is still an effective tool for proving ownership
              of a particular publicKey/address pair.
              <br />
              Note: Digital Signatures and signed messages are not encrypted!
          </InfoParagraph>
          <section>
            <Input className='message' multiline label='Message'
              autoFocus={true}
              value={this.state.message}
              onChange={this.sign.bind(this)} />
          </section>
          {this.state.resultIsShown ?
            <SignVerifyResult result={this.state.result} title='Result' /> :
            <ActionBar
              secondaryButton={{
                onClick: this.props.closeDialog,
              }}
              primaryButton={{
                label: 'Sign and copy result to clipboard',
                className: 'sign-button',
                disabled: !this.state.result || this.state.resultIsShown,
                onClick: this.showResult.bind(this),
              }} />
          }
      </div>
    );
  }
}

export default SignMessageComponent;
