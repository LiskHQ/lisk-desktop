import React from 'react';
import { PrimaryButton } from '../../toolbox/buttons';
import Box from '../../toolbox/box';
import BoxHeader from '../../toolbox/box/header';
import BoxContent from '../../toolbox/box/content';
import BoxFooter from '../../toolbox/box/footer';
import PassphraseBackup from '../../shared/passphraseBackup';
import htmlStringToReact from '../../../utils/htmlStringToReact';
import styles from './secondPassphrase.css';

const FirstStep = ({
  t, nextStep, account,
}) => (
  <Box className={styles.box}>
    <BoxHeader>
      <h2>{t('Register 2nd passphrase')}</h2>
    </BoxHeader>
    <BoxContent>
      <p className={styles.info}>
        {htmlStringToReact(t('secondPassphraseInfoParagraph', 'After registration, your second passphrase will be <strong>required</strong> when <strong>confirming every transaction</strong> and every vote. You are responsible for safekeeping your second passphrase. No one can restore it, not even Lisk. Once activated a second passphrase <strong>can’t be turned off.</strong>', { interpolation: { escapeValue: false } }))}
      </p>
      <PassphraseBackup
        account={account}
        t={t}
        passphraseName={t('Second passphrase')}
        paperWalletName="lisk_passphrase_store_safely"
      />
    </BoxContent>
    <BoxFooter className="summary-footer" direction="horizontal">
      <PrimaryButton
        className={`${styles.confirmBtn} large go-to-confirmation`}
        onClick={nextStep}
      >
        {t('Go to confirmation')}
      </PrimaryButton>
    </BoxFooter>
  </Box>
);

export default FirstStep;
