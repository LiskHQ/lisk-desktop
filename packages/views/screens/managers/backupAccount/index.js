import React from 'react';
import { useTranslation } from 'react-i18next';

import WalletVisual from '@wallet/components/walletVisual';
import useDecryptionAccount from '@account/hooks/useDecryptionAccount';
import { Input } from 'src/theme';
import Box from 'src/theme/box';
import BoxContent from 'src/theme/box/content';
import { PrimaryButton } from 'src/theme/buttons';
import styles from './backupAccount.css';

const AddVote = ({ accountSchema, onEnterPasswordSuccess }) => {
  const { t } = useTranslation();

  const onSubmit = (password) => {
    const { privateToken, recoveryPhrase } = useDecryptionAccount(accountSchema, password);
    onEnterPasswordSuccess({ privateToken, recoveryPhrase });
  };

  return (
    <Box className={styles.container}>
      <BoxContent className={styles.content}>
        <h1>{t('Enter your password')}</h1>
        <p className={styles.subheader}>
          {t('Please provide your device password to backup the recovery phrase.')}
        </p>
        <WalletVisual
          className={styles.avatar}
          address={accountSchema?.metadata?.address || 'lskm555k7nhhw954rw4pqy5q9wn28n3cec94fmp4n'}
        />
        <p className={styles.accountName}>{accountSchema?.metadata?.name || 'Lisker'}</p>
        <p className={styles.accountAddress}>{accountSchema?.metadata?.address || 'lskm555k7nhhw954rw4pqy5q9wn28n3cec94fmp4n'}</p>
        <Input
          className={styles.input}
          placeholder={t('Enter password or use Touch ID')}
          type="password"
        />
        <PrimaryButton
          className={styles.button}
          onClick={onSubmit}
        >
          {t('Continue')}
        </PrimaryButton>
      </BoxContent>
    </Box>
  );
};

export default AddVote;
