import React from 'react';
import Box from '../../toolbox/box';
import BoxContent from '../../toolbox/box/content';
import BoxHeader from '../../toolbox/box/header';
import PassphraseRenderer from '../../shared/passphraseRenderer';
import styles from './secondPassphrase.css';

const ConfirmPassphrase = ({
  t, passphrase, nextStep, prevStep,
}) => (
  <Box className={`${styles.box} ${styles.passphraseConfirmation}`}>
    <BoxHeader>
      <h2>{t('Confirm your 2nd passphrase')}</h2>
    </BoxHeader>
    <BoxContent>
      <div className={styles.passphraseConfirmationContainer}>
        <p className={styles.info}>{t('Based on your passphrase that was generated in the previous step, select the missing words below')}</p>
        <PassphraseRenderer
          passphrase={passphrase}
          nextStep={nextStep}
          prevStep={prevStep}
          isConfirmation
          footerStyle={styles.confirmationFooter}
        />
      </div>
    </BoxContent>
  </Box>
);

export default ConfirmPassphrase;
