import React from 'react';
import { withTranslation } from 'react-i18next';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import PassphraseRenderer from '@wallet/detail/identity/passphraseRenderer';
import registerStyles from '../Signup/register.css';
import styles from './confirmPassphrase.css';

const ConfirmPassphrase = ({
  t, passphrase, prevStep, nextStep,
}) => (
  <>
    <div className={`${registerStyles.titleHolder} ${grid['col-xs-10']}`}>
      <h1>
        {t('Confirm your passphrase')}
      </h1>
      <p className={styles.text}>{t('Keep it safe as it is the only way to access your wallet.')}</p>
    </div>

    <div className={`${grid['col-sm-10']} ${styles.passphraseContainer}`}>
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
