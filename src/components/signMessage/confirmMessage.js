import React from 'react';
import Lisk from '@liskhq/lisk-client';
import CopyToClipboard from 'react-copy-to-clipboard';
import styles from './signMessage.css';
import { AutoresizeTextarea } from '../toolbox/inputsV2';
import { SecondaryButtonV2 } from '../toolbox/buttons/button';

class ConfirmMessage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      result: props.account.passphrase ? this.sign() : '',
      copied: false,
    };

    this.copy = this.copy.bind(this);
  }

  copy() {
    this.setState({ copied: true });
    this.timeout = setTimeout(() => this.setState({ copied: false }), 3000);
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  sign() {
    const { message, account } = this.props;
    const signedMessage = Lisk.cryptography.signMessageWithPassphrase(
      message,
      account.passphrase,
      account.publicKey,
    );
    const result = Lisk.cryptography.printSignedMessage({
      message,
      publicKey: account.publicKey,
      signature: signedMessage.signature,
    });
    return result;
  }

  render() {
    const { t } = this.props;
    const { copied, result } = this.state;
    return (
      <section>
        <div className={styles.header}>
          <span className={styles.step}>{t('Step 2 / 2')}</span>
          <h1>{t('Your signed message')}</h1>
        </div>
        <div className={styles.result}>
          <AutoresizeTextarea className={styles.textarea} readOnly value={result}/>
        </div>
        <div className={styles.buttonsHolder}>
          <CopyToClipboard
            onCopy={this.copy}
            text={result}
          >
            <SecondaryButtonV2 disabled={copied}>
              {copied ? t('Copied!') : t('Copy to Clipboard')}
            </SecondaryButtonV2>
          </CopyToClipboard>
        </div>
      </section>
    );
  }
}

export default ConfirmMessage;
