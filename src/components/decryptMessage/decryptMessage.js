import React from 'react';
import Input from 'react-toolbox/lib/input';
import Lisk from 'lisk-js';
import { translate } from 'react-i18next';
import ActionBar from '../actionBar';
import Authenticate from '../authenticate';
import SignVerifyResult from '../signVerifyResult';

class DecryptMessage extends React.Component {
  constructor() {
    super();
    this.state = {
      result: '',
      senderPublicKey: {
        value: '',
      },
      message: {
        value: '',
      },
      nonce: {
        value: '',
      },
    };
  }

  handleChange(name, value, error) {
    this.setState({
      [name]: {
        value,
        error,
      },
      result: '',
    });
  }

  showResult(event) {
    event.preventDefault();
    let decryptedMessage = null;
    try {
      decryptedMessage = Lisk.crypto.decryptMessageWithSecret(
        this.state.message.value,
        this.state.nonce.value,
        this.props.account.passphrase,
        this.state.senderPublicKey.value);
    } catch (error) {
      this.props.errorToast({ label: this.props.t('Message decryption failed') });
    }
    if (decryptedMessage) {
      this.setState({ result: decryptedMessage });
      this.props.successToast({ label: this.props.t('Message is decrypted successfully') });
    }
  }

  render() {
    return (typeof this.props.account.passphrase === 'string' && this.props.account.passphrase.length > 0 ?
      <div className='decrypt-message'>
        <form onSubmit={this.showResult.bind(this)}>
          <section>
            <Input className='senderPublicKey' label={this.props.t('Sender PublicKey')}
              autoFocus={true}
              value={this.state.senderPublicKey.value}
              onChange={this.handleChange.bind(this, 'senderPublicKey')} />
            <Input className='message' multiline label={this.props.t('Encrypted Message')}
              autoFocus={true}
              value={this.state.message.value}
              onChange={this.handleChange.bind(this, 'message')} />
            <Input className='nonce' label={this.props.t('Nonce')}
              autoFocus={true}
              value={this.state.nonce.value}
              onChange={this.handleChange.bind(this, 'nonce')} />
          </section>
          {this.state.result ?
            <SignVerifyResult result={this.state.result} title={this.props.t('Result')} /> :
            <ActionBar
              secondaryButton={{
                onClick: this.props.closeDialog,
              }}
              primaryButton={{
                label: this.props.t('decrypt'),
                className: 'decrypt-button',
                type: 'submit',
                disabled: (this.state.message.value.length === 0 ||
                  this.state.senderPublicKey.value.length === 0 ||
                  this.state.nonce.value.length === 0
                ),
              }} />
          }
        </form>
      </div> :
      <Authenticate nextAction={this.props.t('decrypt message')}/>
    );
  }
}

export default translate()(DecryptMessage);
