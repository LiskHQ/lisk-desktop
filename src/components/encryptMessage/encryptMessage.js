import React from 'react';
import Input from 'react-toolbox/lib/input';
import Lisk from 'lisk-js';
import { translate } from 'react-i18next';
import InfoParagraph from '../infoParagraph';
import SignVerifyResult from '../signVerifyResult';
import ActionBar from '../actionBar';


class EncryptMessage extends React.Component {
  constructor() {
    super();
    this.state = {
      result: '',
      recipientPublicKey: {},
      message: {},
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

  encrypt() {
    const cryptoResult = Lisk.crypto.encryptMessageWithSecret(
      this.state.message.value,
      this.props.account.passphrase,
      this.state.recipientPublicKey.value);
    const result = [
      '-----ENCRYPTED MESSAGE-----',
      cryptoResult.encryptedMessage,
      '-----NONCE-----',
      cryptoResult.nonce,
    ].join('\n');
    this.setState({ result, resultIsShown: false });
  }

  showResult(event) {
    event.preventDefault();
    const copied = this.props.copyToClipboard(this.state.result, {
      message: this.props.t('Press #{key} to copy'),
    });
    if (copied) {
      this.props.successToast({ label: this.props.t('Result copied to clipboard') });
    }
    this.setState({ resultIsShown: true });
  }

  render() {
    return (
      <div className='sign-message'>
        <form onSubmit={this.showResult.bind(this)}>
          <section>
            <InfoParagraph>
              <h3>
                {this.props.t('Public key : ')}
              </h3>
              {this.props.account.publicKey}
            </InfoParagraph>
            <Input className='recipientPublicKey' label={this.props.t('Recipient PublicKey')}
              autoFocus={true}
              value={this.state.recipientPublicKey.value}
              onChange={this.handleChange.bind(this, 'recipientPublicKey')} />
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
                label: this.props.t('encrypt'),
                className: 'sign-button',
                type: 'submit',
                // disabled: (this.state.message.value ||  this.state.message.value),
                onClick: this.encrypt.bind(this),
              }} />
          }
        </form>
      </div>
    );
  }
}

export default translate()(EncryptMessage);
