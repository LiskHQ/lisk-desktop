import React from 'react';
import Lisk from 'lisk-js';
import styles from './confirmMessage.css';
import { Button } from '../toolbox/buttons/button';
import Input from '../toolbox/inputs/input';
import { passphraseIsValid } from '../../utils/form';
// eslint-disable-next-line import/no-named-as-default
import PassphraseInput from '../passphraseInput';
import TransitionWrapper from '../toolbox/transitionWrapper';
import CopyToClipboard from '../copyToClipboard';
import passphraseStepsStyles from '../passphraseSteps/passphraseSteps.css';

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

  handleChange(name, value, error) {
    this.setState({
      [name]: {
        value,
        error,
      },
    });
  }

  signMessage() {
    this.setState({
      step: 'done',
      result: this.sign(),
    });
  }

  sign() {
    const { message } = this.props;
    const signedMessage = Lisk.crypto.signMessageWithSecret(
      message,
      this.state.passphrase.value,
    );
    const result = Lisk.crypto.printSignedMessage(
      message,
      signedMessage, this.props.account.publicKey,
    );
    return result;
  }

  render() {
    return (
      <section className={`passphrase-verifier ${styles.wrapper} ${styles.verifier}`}>
        <header>
          <div className={styles.tableCell}>
            <TransitionWrapper current={this.state.step} step='verify'>
              <h2 className={styles.verify}>{this.props.t('Please sign in with your passphrase')}</h2>
            </TransitionWrapper>
            <TransitionWrapper current={this.state.step} step='done'>
              <h2 className={styles.verify}>{this.props.t('Your signed message')}</h2>
            </TransitionWrapper>
          </div>
        </header>
        <section className={`${styles.table} ${styles.verify} ${this.state.step === 'verify' ? styles.content : ''}`}>
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
            <div className={`${styles.innerContent} ${styles.passphrase}`}>
              <PassphraseInput
                error={this.state.passphrase.error}
                value={this.state.passphrase.value}
                onChange={this.handleChange.bind(this, 'passphrase')}
                columns={{ xs: 6, sm: 4, md: 2 }}
                isFocused={true}
                className='passphraseInput'
                theme={passphraseStepsStyles}
              />
              <footer>
                <Button
                  label={this.props.t('Confirm')}
                  theme={styles}
                  className={`${styles.confirm} confirm`}
                  onClick={this.signMessage.bind(this)}
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
