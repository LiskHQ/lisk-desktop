import { Trans } from 'react-i18next';
import React from 'react';
import { PrimaryButton, TertiaryButton } from '../toolbox/buttons/button';
import Box from '../box';
import PassphraseBackup from '../passphraseBackup';
import styles from './secondPassphrase.css';

const FirstStep = ({
  t, goBack, nextStep, account,
}) => (
  <Box>
    <header>
      <h2>{t('Register 2nd passphrase')}</h2>
    </header>
    <Trans>
      <p className={styles.info}>
        After registration, your second passphrase will be
        {' '}
        <strong>required </strong>
        when
        {' '}
        <strong>confirming every transaction</strong>
        {' '}
and every vote.
        You are responsible for safekeeping your second passphrase.
        No one can restore it, not even Lisk.
        Once activated a second passphrase
        {' '}
        <strong>can’t be turned off.</strong>
      </p>
    </Trans>
    <PassphraseBackup
      account={account}
      t={t}
      passphraseName={t('Second passphrase')}
      paperWalletName="lisk_2nd_passphrase"
    />
    <footer className={`${styles.footer} summary-footer`}>
      <PrimaryButton
        className={`${styles.confirmBtn} large go-to-confirmation`}
        onClick={nextStep}
      >
        {t('Go to confirmation')}
      </PrimaryButton>
      <TertiaryButton
        className={`${styles.editBtn} large go-back`}
        onClick={goBack}
      >
        {t('Go back')}
      </TertiaryButton>
    </footer>
  </Box>
);

export default FirstStep;
