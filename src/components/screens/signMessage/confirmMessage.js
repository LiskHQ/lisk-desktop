import React from 'react';
import { Link } from 'react-router-dom';
import liskClient from 'Utils/lisk-client'; // eslint-disable-line
import CopyToClipboard from 'react-copy-to-clipboard';
import styles from './signMessage.css';
import { AutoResizeTextarea } from '../../toolbox/inputs';
import { SecondaryButton, TertiaryButton } from '../../toolbox/buttons/button';
import routes from '../../../constants/routes';

class ConfirmMessage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
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
    const Lisk = liskClient();
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
    const { copied } = this.state;
    const result = this.sign();
    return (
      <section>
        <div className={styles.header}>
          <h1>{t('Your signed message')}</h1>
        </div>
        <div className={styles.result}>
          <AutoResizeTextarea
            className={`${styles.textarea} result`}
            value={result}
            readOnly
          />
        </div>
        <div className={styles.buttonsHolder}>
          <CopyToClipboard
            onCopy={this.copy}
            text={result}
          >
            <SecondaryButton disabled={copied}>
              {copied ? t('Copied!') : t('Copy to clipboard')}
            </SecondaryButton>
          </CopyToClipboard>
          <Link to={routes.dashboard.path}>
            <TertiaryButton>
              {t('Go to Dashboard')}
            </TertiaryButton>
          </Link>
        </div>
      </section>
    );
  }
}

export default ConfirmMessage;
