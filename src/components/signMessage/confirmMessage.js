import React from 'react';
import Lisk from '@liskhq/lisk-client';
import ToolBoxInput from '../toolbox/inputs/toolBoxInput';
import CopyToClipboard from '../copyToClipboard';
import styles from './signMessage.css';

class ConfirmMessage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      result: props.account.passphrase ? this.sign() : '',
    };
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
    return (
      <section>
        <div className={styles.header}>
          <span className={styles.step}>{t('Step 2/2')}</span>
          <h1>{t('Your signed message')}</h1>
        </div>
        <div>
          <ToolBoxInput multiline readOnly value={this.state.result} />
        </div>
        <div className={styles.buttonsHolder}>
          <CopyToClipboard
            value={this.state.result}
            text={t('Copy to Clipboard')}/>
        </div>
      </section>
    );
  }
}

export default ConfirmMessage;
