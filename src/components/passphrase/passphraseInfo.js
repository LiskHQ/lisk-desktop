import React from 'react';
import InfoParagraph from '../infoParagraph';
import ActionBar from '../actionBar';
import styles from './passphrase.css';
import PassphraseTheme from './passphraseTheme';

const PassphraseInfo = ({ t, useCaseNote, securityNote, fee, nextStep, backButtonFn }) => (
  <div>
    <PassphraseTheme>
      <InfoParagraph className={styles.noHr}>
        {t('Please click Next, then move around your mouse randomly to generate a random passphrase.')}
        <br />
        <br />
        {t('Note: After registration completes,')} { useCaseNote }
        <br />
        { securityNote } {t('Please keep it safe!')}
      </InfoParagraph>
    </PassphraseTheme>

    <ActionBar
      secondaryButton={{
        label: t('Back'),
        onClick: typeof backButtonFn === 'function' ? backButtonFn : () => {},
      }}
      primaryButton={{
        label: t('Next'),
        fee,
        className: 'next-button',
        onClick: () => nextStep(),
      }} />
  </div>);


export default PassphraseInfo;
