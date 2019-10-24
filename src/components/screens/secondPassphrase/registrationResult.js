import React from 'react';
import Box from '../../toolbox/box';
import Illustration from '../../toolbox/illustration';
import styles from './secondPassphrase.css';
import { PrimaryButton } from '../../toolbox/buttons/button';

const RegistrationResult = ({
  t, finalCallback, message, illustration,
}) => (
  <Box className={styles.passphraseConfirmation}>
    <Box.Header>
      <h2>{t('Registration completed')}</h2>
    </Box.Header>
    <Box.Content className={styles.transactionResultContent}>
      <Illustration name={illustration} />
      <h1 className={styles.header}>{t('Second passphrase registration submitted')}</h1>
      <p className={styles.info}>{message}</p>
    </Box.Content>
    <Box.Footer className={styles.confirmPassphraseFooter}>
      <PrimaryButton
        className={styles.confirmBtn}
        onClick={finalCallback}
      >
        {t('Go to wallet')}
      </PrimaryButton>
    </Box.Footer>
  </Box>
);

export default RegistrationResult;
