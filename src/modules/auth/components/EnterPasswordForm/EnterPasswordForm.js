import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';

import WalletVisual from '@wallet/components/walletVisual';
import { decryptAccount } from '@account/utils/encryptAccount';
import { selectActiveTokenAccount } from 'src/redux/selectors';
import { useAccounts, useCurrentAccount } from '@account/hooks';
import { Input } from 'src/theme';
import Box from 'src/theme/box';
import BoxContent from 'src/theme/box/content';
import { PrimaryButton } from 'src/theme/buttons';
import styles from './EnterPasswordForm.css';

const API_ERROR_NAME = 'API_ERROR_NAME';

// eslint-disable-next-line max-statements
const EnterPasswordForm = ({ onEnterPasswordSuccess, title, encryptedAccount, isDisabled }) => {
  const { t } = useTranslation();
  const {
    register,
    watch,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm();
  const apiError = errors[API_ERROR_NAME];
  const activeAccount = useSelector(selectActiveTokenAccount);
  const { getAccountByAddress } = useAccounts();
  const [currentAccount] = useCurrentAccount();
  const requestedAccount = getAccountByAddress(activeAccount.summary.address);
  const account = useMemo(
    () => encryptedAccount || requestedAccount || currentAccount,
    [currentAccount]
  );
  const formValues = watch();

  const onSubmit = async ({ password }) => {
    const { error, result } = await decryptAccount(account.encryptedPassphrase, password);

    if (error) {
      setError(API_ERROR_NAME, {
        type: 'custom',
        message: t('Unable to decrypt account. Please check your password'),
      });
    } else {
      onEnterPasswordSuccess({
        recoveryPhrase: result.recoveryPhrase,
        encryptedAccount: account,
        privateKey: result.privateKey,
      });
    }
  };

  return (
    <Box className={styles.container}>
      <BoxContent className={styles.content}>
        <h1>{t('Enter your password')}</h1>
        <p className={styles.subheader}>
          {t(title || 'Please provide your device password to backup the recovery phrase.')}
        </p>
        <WalletVisual className={styles.avatar} address={account?.metadata?.address} />
        {account?.metadata?.name && <p className={styles.accountName}>{account?.metadata?.name}</p>}
        <p className={styles.accountAddress}>{account?.metadata?.address}</p>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            secureTextEntry
            size="s"
            placeholder={t('Enter password')}
            feedback={apiError?.message}
            error={!!apiError}
            {...register('password', {
              onChange: () => apiError && clearErrors(API_ERROR_NAME),
            })}
          />
          <PrimaryButton
            type="submit"
            disabled={isDisabled || !formValues.password}
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
