import React from 'react';
import liskClient from 'Utils/lisk-client'; // eslint-disable-line
import CopyToClipboard from 'react-copy-to-clipboard';
import styles from './signMessage.css';
import Box from '../../toolbox/box';
import BoxContent from '../../toolbox/box/content';
import BoxFooter from '../../toolbox/box/footer';
import BoxHeader from '../../toolbox/box/header';
import { AutoResizeTextarea } from '../../toolbox/inputs';
import { SecondaryButton, PrimaryButton } from '../../toolbox/buttons';

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
    const Lisk = liskClient()['2.x'];
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
    const { t, prevStep } = this.props;
    const { copied } = this.state;
    const result = this.sign();
    return (
      <Box>
        <BoxHeader>
          <h1>{t('Sign a message')}</h1>
        </BoxHeader>
        <BoxContent className={styles.noPadding}>
          <AutoResizeTextarea
            className={`${styles.result} result`}
            value={result}
            readOnly
          />
        </BoxContent>
        <BoxFooter direction="horizontal">
          <SecondaryButton onClick={prevStep} className={styles.button}>
            {t('Go back')}
          </SecondaryButton>
          <CopyToClipboard
            onCopy={this.copy}
            text={result}
          >
            <PrimaryButton disabled={copied} className={styles.button}>
              {copied ? t('Copied!') : t('Copy to clipboard')}
            </PrimaryButton>
          </CopyToClipboard>
        </BoxFooter>
      </Box>
    );
  }
}

export default ConfirmMessage;
