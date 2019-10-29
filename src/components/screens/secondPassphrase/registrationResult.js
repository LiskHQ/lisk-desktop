import React from 'react';
import Box from '../../toolbox/box';
import Illustration from '../../toolbox/illustration';
import styles from './secondPassphrase.css';
import { PrimaryButton } from '../../toolbox/buttons/button';

const RegistrationResult = ({
  t, finalCallback, message, illustration, title, header,
}) => (
  <Box width="medium" className={`${styles.passphraseConfirmation}`}>
    <Box.Header>
      <h2>{header}</h2>
    </Box.Header>
    <Box.Content className={styles.transactionResultContent}>
      <Illustration name={illustration} />
      <h1 className={styles.header}>{title}</h1>
      <p className={styles.info}>{message}</p>
    </Box.Content>
    <Box.Footer className={styles.confirmPassphraseFooter}>
      <PrimaryButton
        className={[styles.confirmBtn, 'go-to-wallet'].join(' ')}
        onClick={finalCallback}
      >
        {t('Go to wallet')}
      </PrimaryButton>
    </Box.Footer>
  </Box>
);

export default RegistrationResult;
