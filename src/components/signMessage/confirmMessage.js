import React from 'react';
import Lisk from 'lisk-js';
import styles from './confirmMessage.css';
import { Button } from '../toolbox/buttons/button';
import Input from '../toolbox/inputs/input';
import { extractAddress, extractPublicKey } from '../../utils/account';
import { passphraseIsValid } from '../../utils/form';
// eslint-disable-next-line import/no-named-as-default
import PassphraseInput from '../passphraseInput';
import TransitionWrapper from '../toolbox/transitionWrapper';
import CopyToClipboard from '../copyToClipboard';

class ConfirmMessage extends React.Component {
  constructor() {
    super();
    this.state = {
      step: 'verify',
      formStatus: 'clean',
      passphrase: {
        value: '',
        error: '',
      },
      result: '',
    };
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  handleChange(name, value, error) {
    const { publicKey } = this.props.account;
    if (!error && extractPublicKey(value) !== publicKey) {
      error = this.props.t('Entered passphrase does not belong to the active account');
    }

    this.setState({
      [name]: {
        value,
        error: typeof error === 'string' ? error : undefined,
      },
    });
  }

  next() {
    setTimeout(() => {
      this.setState({ step: 'login' });
    }, 800);
  }

  signMessage() {
    this.setState({
      step: 'done',
      result: this.sign(),
    });
  }

  // eslint-disable-next-line  class-methods-use-this
  focus({ nativeEvent }) {
    nativeEvent.target.focus();
  }

  getAddress() {
    return extractAddress(this.props.passphrase);
  }

  sign() {
    const { message } = this.props;
    const signedMessage = Lisk.crypto.signMessageWithSecret(message,
      this.state.passphrase.value);
    const result = Lisk.crypto.printSignedMessage(
      message, signedMessage, this.props.account.publicKey);
    return result;
  }

  render() {
    return (
      <section className={`passphrase-verifier ${styles.wrapper} ${styles.verifier}`}>
        <header className={styles.table}>
          <div className={styles.tableCell}>
            <TransitionWrapper current={this.state.step} step='verify'>
              <h2 className={styles.verify}>{this.props.t('Please Confirm your passphrase')}</h2>
            </TransitionWrapper>
            <h5 className={`${styles.verify}`}>
              {this.props.t('Please go back and check your passphrase again.')}
            </h5>

            <TransitionWrapper current={this.state.step} step='done'>
              <h2 className={styles.verify}>{this.props.t('Your signed message')}</h2>
            </TransitionWrapper>
          </div>
        </header>
        <section className={`${styles.table} ${styles.verify} ${styles.content}`}>
          <TransitionWrapper current={this.state.step} step='done'>
            <div className={styles.resultWrapper}>
              <Input className={`${styles.result} result`} multiline readOnly value={this.state.result} />
            </div>
          </TransitionWrapper>

          <TransitionWrapper current={this.state.step} step='done'>
            <div className={`${styles.innerContent} ${styles.copySection}`}>
              <div className={styles.copyBorder}>
                <CopyToClipboard
                  value={this.state.result}
                  className={`${styles.address} account-information-address`}
                  copyClassName={styles.copy}
                  text={this.props.t('Copy to Clipboard')}/>
              </div>
            </div>
          </TransitionWrapper>

          <TransitionWrapper current={this.state.step} step='verify'>
            <div className={styles.innerContent}>
              <PassphraseInput
                error={this.state.passphrase.error}
                value={this.state.passphrase.value}
                onChange={this.handleChange.bind(this, 'passphrase')}
                columns={{ xs: 6, sm: 4, md: 2 }}
                isFocused={true}
                className='passphraseInput'
              />
              <footer>
                <Button
                  label={this.props.t('Confirm')}
                  theme={styles}
                  className={'confirm'}
                  onClick={this.signMessage.bind(this, 'passphrase')}
                  disabled={!passphraseIsValid(this.state.passphrase)}
                />
              </footer>
            </div>
          </TransitionWrapper>
        </section>
      </section>
    );
  }
}

export default ConfirmMessage;
