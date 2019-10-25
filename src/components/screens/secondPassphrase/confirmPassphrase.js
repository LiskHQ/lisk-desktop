import React from 'react';
import PassphraseRenderer from '../../shared/passphraseRenderer';
import Box from '../../toolbox/box';
import styles from './secondPassphrase.css';

const ConfirmPassphrase = ({
  t, passphrase, nextStep, prevStep,
}) => (
  <Box className={styles.passphraseConfirmation}>
    <Box.Header>
      <h2>{t('Confirm your 2nd passphrase')}</h2>
    </Box.Header>
    <Box.Content>
      <div className={styles.passphraseConfirmationContainer}>
        <p className={styles.info}>{t('Based on your passphrase that was generated in the previous step, select the missing words below')}</p>
        <PassphraseRenderer
          passphrase={passphrase}
          values={passphrase.split(' ')}
          nextStep={nextStep}
          prevStep={prevStep}
          isConfirmation
          footerStyle={styles.confirmationFooter}
        />
      </div>
    </Box.Content>
  </Box>
);

export default ConfirmPassphrase;
