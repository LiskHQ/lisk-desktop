import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';

import WalletVisual from '@wallet/components/walletVisual';
import { decryptAccount } from '@account/utils/encryptAccount';
import { useCurrentAccount } from '@account/hooks';
import { Input } from 'src/theme';
import Box from 'src/theme/box';
import BoxContent from 'src/theme/box/content';
import { PrimaryButton } from 'src/theme/buttons';
import styles from './EnterPasswordForm.css';

const EnterPasswordForm = ({ onEnterPasswordSuccess, title, encryptedAccount }) => {
  const { t } = useTranslation();
  const {
    register,
    watch,
    handleSubmit,
  } = useForm();
  const [currentAccount] = useCurrentAccount();
  const [feedbackError, setFeedbackError] = useState('');
  const account = useMemo(() => encryptedAccount || currentAccount, [currentAccount]);
  const formValues = watch();

  const onSubmit = async ({ password }) => {
    const { error, result } = await decryptAccount(
      account.encryptedPassphrase, password,
    );

    if (error) {
      const errorMessage = t('Unable to decrypt account. Please check your password');
      return setFeedbackError(errorMessage);
    }

    return onEnterPasswordSuccess({
      recoveryPhrase: result.recoveryPhrase,
      encryptedAccount: account,
      privateKey: result.privateKey,
    });
  };

  return (
    <Box className={styles.container}>
      <BoxContent className={styles.content}>
        <h1>{t('Enter your password')}</h1>
        <p className={styles.subheader}>
          {t(title || 'Please provide your device password to backup the recovery phrase.')}
        </p>
        <WalletVisual
          className={styles.avatar}
          address={account?.metadata?.address}
        />
        {account?.metadata?.name && (
          <p className={styles.accountName}>{account?.metadata?.name}</p>
        )}
        <p className={styles.accountAddress}>{account?.metadata?.address}</p>
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
