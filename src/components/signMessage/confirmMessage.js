import React from 'react';
import Lisk from 'lisk-elements';
import styles from './confirmMessage.css';
import { Button } from '../toolbox/buttons/button';
import ToolBoxInput from '../toolbox/inputs/toolBoxInput';
import { passphraseIsValid } from '../../utils/form';
import { extractPublicKey } from '../../utils/account';
// eslint-disable-next-line import/no-named-as-default
import PassphraseInput from '../passphraseInput';
import TransitionWrapper from '../toolbox/transitionWrapper';
import CopyToClipboard from '../copyToClipboard';
import Piwik from '../../utils/piwik';
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

  componentWillMount() {
    if (this.props.account.passphrase) {
      this.signMessage();
    }
  }

  handleChange(name, value, error) {
    if (!error) {
      const publicKeyMap = {
        passphrase: 'publicKey',
        secondPassphrase: 'secondPublicKey',
      };

      const expectedPublicKey = this.props.account[publicKeyMap[name]];

      if (expectedPublicKey && expectedPublicKey !== extractPublicKey(value)) {
        error = this.props.t('Entered passphrase does not belong to the active account');
      }
    }
    this.setState({
      [name]: {
        value,
        error,
      },
    });
  }

  signMessage() {
    Piwik.trackingEvent('ConfirmMessage', 'button', 'onConfirm');
    this.setState({
      step: 'done',
      result: this.sign(),
    });
  }

  sign() {
    const { message } = this.props;
    const signedMessage = Lisk.cryptography.signMessageWithPassphrase(
      message,
      this.state.passphrase.value || this.props.account.passphrase,
      this.props.account.publicKey,
    );
    const result = Lisk.cryptography.printSignedMessage({
      message,
      publicKey: this.props.account.publicKey,
      signature: signedMessage.signature,
    });
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
              <ToolBoxInput className={`${styles.result} result`} multiline readOnly value={this.state.result} />
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
