import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import WalletVisual from '@wallet/components/walletVisual';
import useDecryptionAccount from '@account/hooks/useDecryptionAccount';
import { Input } from 'src/theme';
import Icon from 'src/theme/Icon';
import Box from 'src/theme/box';
import BoxContent from 'src/theme/box/content';
import { PrimaryButton } from 'src/theme/buttons';
import styles from './backupAccount.css';

const AddVote = ({ accountSchema, onEnterPasswordSuccess }) => {
  const { t } = useTranslation();
  const [isPasswordVisible, togglePasswordVisibility] = useState(false);
  const [password, setPassword] = useState('');

  const onSubmit = () => {
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
        <div className={styles.inputWrapper}>
          <Input
            placeholder={t('Enter password or use Touch ID')}
            type={isPasswordVisible ? 'text' : 'password'}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <Icon
            className={styles.eyeIcon}
            name={isPasswordVisible ? 'eyeActive' : 'eyeInactive'}
            onClick={() => {
              togglePasswordVisibility(!isPasswordVisible);
            }}
          />
        </div>
        <PrimaryButton
          className={styles.button}
          onClick={onSubmit}
          disabled={!password}
        >
          {t('Continue')}
        </PrimaryButton>
      </BoxContent>
    </Box>
  );
};

export default AddVote;
