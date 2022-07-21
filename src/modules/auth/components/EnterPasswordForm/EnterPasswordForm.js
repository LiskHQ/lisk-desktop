import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';

import WalletVisual from '@wallet/components/walletVisual';
import { decryptAccount } from '@account/utils/decryptAccount';
import { Input } from 'src/theme';
import Box from 'src/theme/box';
import BoxContent from 'src/theme/box/content';
import { PrimaryButton } from 'src/theme/buttons';
import styles from './EnterPasswordForm.css';

const EnterPasswordForm = ({ encryptedAccount, onEnterPasswordSuccess }) => {
  const { t } = useTranslation();
  const {
    register,
    watch,
    handleSubmit,
  } = useForm();
  const [feedbackError, setFeedbackError] = useState('');

  const formValues = watch();

  const onSubmit = ({ password }) => {
    const account = decryptAccount(encryptedAccount, password);
    if (account.error) {
      setFeedbackError(t('Unable to decrypt account. Please check your password'));
      return;
    }

    onEnterPasswordSuccess({
      account,
      recoveryPhrase: account.recoveryPhrase,
      encryptedPhrase: encryptedAccount,
    });
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
          address={encryptedAccount?.metadata?.address}
        />
        {encryptedAccount?.metadata?.name && (
          <p className={styles.accountName}>{encryptedAccount?.metadata?.name}</p>
        )}
        <p className={styles.accountAddress}>{encryptedAccount?.metadata?.address}</p>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            secureTextEntry
            size="s"
            placeholder={t('Enter password')}
            feedback={feedbackError}
            {...register('password')}
          />
          <PrimaryButton
            type="submit"
            disabled={!formValues.password}
            className={`${styles.button} continue-btn`}
          >
            {t('Continue')}
          </PrimaryButton>
        </form>
      </BoxContent>
    </Box>
  );
};

export default EnterPasswordForm;
