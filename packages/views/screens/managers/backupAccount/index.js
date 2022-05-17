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
        <p>{t('Please provide your device password to backup the recovery phrase.')}</p>
        <WalletVisual
          address="lskm555k7nhhw954rw4pqy5q9wn28n3cec94fmp4n"
        />
        <p>{accountSchema?.metadata?.name}</p>
        <p>{accountSchema?.metadata?.address}</p>
        <Input
          placeholder={t('Enter password or use Touch ID')}
          type="password"
        />
        <PrimaryButton
          onClick={onSubmit}
          disabled={}
        >
          {t('Continue')}
        </PrimaryButton>
      </BoxContent>
    </Box>
  );
};

export default AddVote;
