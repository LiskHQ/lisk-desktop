import React from 'react';
import Input from 'react-toolbox/lib/input';
import Lisk from 'lisk-js';
import { translate } from 'react-i18next';
import SignVerifyResult from '../signVerifyResult';
import ActionBar from '../actionBar';

class DecryptMessage extends React.Component {
  constructor() {
    super();
    this.state = {
      result: '',
      nonce: {
        value: '',
      },
      message: {
        value: '',
      },
      senderPublicKey: {
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
      this.props.errorToast({ label: error.message });
    }
    if (decryptedMessage) {
      const result = [
        '-----DECRYPTED MESSAGE-----',
        decryptedMessage,
      ].join('\n');
      this.setState({ result, resultIsShown: false });
      this.setState({ resultIsShown: true });
      this.props.successToast({ label: this.props.t('Message is decrypted successfully') });
    }
  }

  render() {
    return (
      <div className='sign-message'>
        <form onSubmit={this.showResult.bind(this)}>
          <section>
            <Input className='senderPublicKey' label={this.props.t('Sender PublicKey')}
              autoFocus={true}
              value={this.state.senderPublicKey.value}
              onChange={this.handleChange.bind(this, 'senderPublicKey')} />
            <Input className='nonce' label={this.props.t('Nonce')}
              autoFocus={true}
              value={this.state.nonce.value}
              onChange={this.handleChange.bind(this, 'nonce')} />
            <Input className='message' multiline label={this.props.t('Message')}
              autoFocus={true}
              value={this.state.message.value}
              onChange={this.handleChange.bind(this, 'message')} />

          </section>
          {this.state.resultIsShown ?
            <SignVerifyResult result={this.state.result} title={this.props.t('Result')} /> :
            <ActionBar
              secondaryButton={{
                onClick: this.props.closeDialog,
              }}
              primaryButton={{
                label: this.props.t('decrypt'),
                className: 'sign-button',
                type: 'submit',
                disabled: (this.state.message.value.length === 0 ||
                  this.state.senderPublicKey.value.length === 0 ||
                  this.state.nonce.value.length === 0
                ),
              }} />
          }
        </form>
      </div>
    );
  }
}

export default translate()(DecryptMessage);
