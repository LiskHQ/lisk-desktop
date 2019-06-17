import React from 'react';

import { PrimaryButtonV2, TertiaryButtonV2 } from '../toolbox/buttons/button';
import BoxV2 from '../boxV2';
import styles from './secondPassphrase.css';

const FirstStep = ({
  t, goBack, nextStep,
}) => (
  <BoxV2>
    <header>
      <h2>{t('Register 2nd passphrase')}</h2>
    </header>
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
