import { translate } from 'react-i18next';
import React from 'react';
import lisk from 'lisk-js';
import Input from './../toolbox/input';
import InfoParagraph from '../infoParagraph';
import SignVerifyResult from '../signVerifyResult';

class VerifyMessage extends React.Component {
  constructor() {
    super();
    this.state = {
      publicKey: {
        error: '',
        value: '',
      },
      signature: {
        error: '',
        value: '',
      },
      result: '',
    };
  }

  handleChange(name, value) {
    const newState = this.state;
    newState[name].value = value;
    this.setState(this.verify(newState));
  }

  verify(newState) {
    newState.publicKey.error = '';
    newState.signature.error = '';
    newState.result = '';
    try {
      newState.result = lisk.crypto.verifyMessageWithPublicKey(
        this.state.signature.value, this.state.publicKey.value);
    } catch (e) {
      if (e.message.indexOf('Invalid publicKey') !== -1 && this.state.publicKey.value) {
        newState.publicKey.error = this.props.t('Invalid');
      } else if (e.message.indexOf('Invalid signature') !== -1 && this.state.signature.value) {
        newState.signature.error = this.props.t('Invalid');
      }
      newState.result = '';
    }
    return newState;
  }

  render() {
    return (
      <div className='verify-message'>
        <InfoParagraph>
          {this.props.t('When you have the signature, you only need the publicKey of the signer in order to verify that the message came from the right private/publicKey pair. Be aware, everybody knowing the signature and the publicKey can verify the message. If ever there is a dispute, everybody can take the publicKey and signature to a judge and prove that the message is coming from the specific private/publicKey pair.')}
        </InfoParagraph>
        <section>
          <Input className='public-key' type='text' label={this.props.t('Public Key')}
            autoFocus="true"
            value={this.state.publicKey.value}
            error={this.state.publicKey.error}
            onChange={this.handleChange.bind(this, 'publicKey')} />
          <Input className='signature' multiline label={this.props.t('Signature')}
            value={this.state.signature.value}
            error={this.state.signature.error}
            onChange={this.handleChange.bind(this, 'signature')} />
        </section>
        {this.state.result ?
          <SignVerifyResult result={this.state.result} title={this.props.t('Original Message')} /> :
          null
        }
      </div>
    );
  }
}

export default translate()(VerifyMessage);
