import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import WalletVisual from '@wallet/components/walletVisual';
import { decryptAccount } from '@account/utils/decryptAccount';
import { Input } from 'src/theme';
import Box from 'src/theme/box';
import BoxContent from 'src/theme/box/content';
import { PrimaryButton } from 'src/theme/buttons';
import styles from './enterPasswordForm.css';

const EnterPasswordForm = ({ accountSchema, onEnterPasswordSuccess }) => {
  const { t } = useTranslation();
  const [password, setPassword] = useState('');
  const [feedbackError, setFeedbackError] = useState('');

  const onSubmit = () => {
    const { privateToken, recoveryPhrase, error } = decryptAccount(accountSchema, password);
    if (error) {
      return setFeedbackError(t('Unable to decrypt account, please check the password'));
    }

    return onEnterPasswordSuccess({ privateToken, recoveryPhrase });
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
          address={accountSchema?.metadata?.address}
        />
        {accountSchema?.metadata?.name && (
          <p className={styles.accountName}>{accountSchema?.metadata?.name}</p>
        )}
        <p className={styles.accountAddress}>{accountSchema?.metadata?.address}</p>
        <Input
          name="passwordField"
          placeholder={t('Enter password')}
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          feedback={feedbackError}
        />
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

export default EnterPasswordForm;
