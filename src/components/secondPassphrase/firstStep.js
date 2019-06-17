import React from 'react';

import { PrimaryButtonV2, TertiaryButtonV2 } from '../toolbox/buttons/button';
import BoxV2 from '../boxV2';
import PassphraseBackup from '../passphraseBackup';
import styles from './secondPassphrase.css';

const FirstStep = ({
  t, goBack, nextStep, account,
}) => (
  <BoxV2>
    <header>
      <h2>{t('Register 2nd passphrase')}</h2>
    </header>
    <p>
     {t('After registration, your second passphrase will be required when confirming every transaction and every vote. You are responsible for safeeeping your second passphrase. No one can restore it, not even Lisk. Once activated a second passphrase can’t be turned off.')}
    </p>
    <PassphraseBackup t={t} nextStep={nextStep} account={account} />
    <footer className='summary-footer'>
        <PrimaryButtonV2
          className={`${styles.confirmBtn} go-to-confirmation`}
          onClick={nextStep}>
          {t('Go to Confirmation')}
        </PrimaryButtonV2>
      <TertiaryButtonV2
        className={`${styles.editBtn} go-back`}
        onClick={goBack}>
          {t('Go back')}
      </TertiaryButtonV2>
    </footer>
  </BoxV2>
);

export default FirstStep;
