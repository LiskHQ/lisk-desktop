import React from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';

import WalletVisual from '@wallet/components/walletVisual';
import { decryptionAccount } from '@account/utils/decryptionAccount';
import { Input } from 'src/theme';
import Box from 'src/theme/box';
import BoxContent from 'src/theme/box/content';
import { PrimaryButton } from 'src/theme/buttons';
import styles from './EnterPasswordForm.css';

const EnterPasswordForm = ({ accountSchema, onEnterPasswordSuccess, nextStep }) => {
  const { t } = useTranslation();
  const {
    register,
    watch,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const formValues = watch();

  const onSubmit = ({ password }) => {
    const account = decryptionAccount(accountSchema, password);
    onEnterPasswordSuccess({ account, recoveryPhrase: account.recoveryPhrase });
    nextStep({ encryptedPhrase: accountSchema });
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
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            secureTextEntry
            size="s"
            placeholder={t('Enter password')}
            feedback={errors.password?.message}
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
