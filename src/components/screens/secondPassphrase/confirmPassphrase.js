import React from 'react';
import PassphraseRenderer from '../../shared/passphraseRenderer';
import Box from '../../toolbox/box';
import styles from './secondPassphrase.css';
import { PrimaryButton, TertiaryButton } from '../../toolbox/buttons/button';

class ConfirmPassphrase extends React.Component {
  constructor() {
    super();
    this.state = {
      disableButton: true,
      shouldVerify: false,
    };

    this.verifyChoices = this.verifyChoices.bind(this);
  }

  verifyChoices() {
    this.setState({ shouldVerify: true });
    this.timeout = setTimeout(() => this.setState({ shouldVerify: false }), 1000);
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  render() {
    const {
      t, passphrase, nextStep, prevStep,
    } = this.props;
    const { shouldVerify } = this.state;
    return (
      <Box>
        <Box.Header>
          <h2>{t('Confirm your 2nd passphrase')}</h2>
        </Box.Header>
        <Box.Content>
          <div className={styles.passphraseConfirmationContainer}>
            <p className={styles.info}>{t('Based on your passphrase that was generated in the previous step, select the missing words below')}</p>
            <PassphraseRenderer
              passphrase={passphrase}
              toggleButtonStatus={status => this.setState({ disableButton: status })}
              shouldVerify={shouldVerify}
              values={passphrase.split(' ')}
              nextStep={() => nextStep()}
              isConfirmation
            />
          </div>
        </Box.Content>
        <Box.Footer>
          <PrimaryButton
            className={styles.confirmBtn}
            onClick={this.verifyChoices}
          >
            {t('Confirm')}
          </PrimaryButton>
          <TertiaryButton
            className={styles.editBtn}
            onClick={prevStep}
          >
            {t('Go back')}
          </TertiaryButton>
        </Box.Footer>
      </Box>
    );
  }
}

export default ConfirmPassphrase;
