import React from 'react';
import { withTranslation } from 'react-i18next';
import PassphraseRenderer from '@wallet/components/passphraseRenderer';
import registerStyles from '../Signup/register.css';
import styles from './confirmPassphrase.css';

const ConfirmPassphrase = ({ t, passphrase, prevStep, nextStep }) => (
  <>
    <div className={registerStyles.titleHolder}>
      <h1>{t('Confirm your secret recovery phrase')}</h1>
      <p className={styles.text}>
        {t(
          'Please choose the correct words from the list below to complete your secret recovery phrase.'
        )}
      </p>
    </div>
    <div className={styles.passphraseContainer}>
      <PassphraseRenderer
        showInfo
        passphrase={passphrase}
        nextStep={nextStep}
        prevStep={prevStep}
        isConfirmation
      />
    </div>
  </>
);

export default withTranslation()(ConfirmPassphrase);
