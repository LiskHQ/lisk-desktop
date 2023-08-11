import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import Icon from 'src/theme/Icon';
import WalletVisual from '@wallet/components/walletVisual';
import { useAccounts, useCurrentAccount } from '@account/hooks';
import { Input } from 'src/theme';
import Box from 'src/theme/box';
import BoxContent from 'src/theme/box/content';
import { PrimaryButton, TertiaryButton } from 'src/theme/buttons';
import styles from './EnterPasswordForm.css';

const API_ERROR_NAME = 'API_ERROR_NAME';

// eslint-disable-next-line max-statements
const EnterPasswordForm = ({
  onEnterPasswordSuccess,
  title,
  encryptedAccount,
  isDisabled,
  confirmText,
  className,
  prevStep,
  showBackButton,
}) => {
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
  const [isLoading, setIsLoading] = useState(false);
  const { getAccountByAddress } = useAccounts();
  const [currentAccount] = useCurrentAccount();
  const requestedAccount = getAccountByAddress(currentAccount?.metadata?.address);
  const account = useMemo(
    () => encryptedAccount || requestedAccount || currentAccount,
    [currentAccount]
  );
  const formValues = watch();

  const onSubmit = async ({ password }) => {
    setIsLoading(true);

    const decryptAccountWorker = new Worker(new URL('./decryptAccount.worker.js', import.meta.url));
    /* istanbul ignore next */
    const showDecryptAccountError = () => {
      setError(API_ERROR_NAME, {
        type: 'custom',
        message: t('Unable to decrypt account. Please check your password'),
      });
      setIsLoading(false);
    };

    decryptAccountWorker.postMessage({
      account,
      password,
    });

    decryptAccountWorker.onmessage = ({ data: { error, result } }) => {
      if (error) return showDecryptAccountError();

      onEnterPasswordSuccess({
        recoveryPhrase: result.recoveryPhrase,
        encryptedAccount: account,
        privateKey: result.privateKey,
      });

      decryptAccountWorker.terminate();
      return setIsLoading(false);
    };

    decryptAccountWorker.onerror = showDecryptAccountError;
  };

  return (
    <Box className={`${styles.container} ${className}`}>
      <BoxContent className={styles.content}>
        {showBackButton && (
          <TertiaryButton className={styles.backButton} onClick={prevStep}>
            <Icon name="arrowLeftTailed" />
          </TertiaryButton>
        )}
        <h1>{t('Enter your account password')}</h1>
        <p className={styles.subheader}>
          {title || t('Please enter your account password to backup the secret recovery phrase.')}
        </p>
        <WalletVisual className={styles.avatar} address={account?.metadata?.address} />
        {account?.metadata?.name && <p className={styles.accountName}>{account?.metadata?.name}</p>}
        <p className={styles.accountAddress}>{account?.metadata?.address}</p>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            secureTextEntry
            size="l"
            placeholder={t('Enter password')}
            feedback={apiError?.message}
            error={!!apiError}
            {...register('password', {
              onChange: () => apiError && clearErrors(API_ERROR_NAME),
            })}
          />
          <PrimaryButton
            type="submit"
            isLoading={isLoading}
            disabled={isDisabled || !formValues.password}
            className={`${styles.button} continue-btn`}
          >
            {t(confirmText || 'Continue')}
          </PrimaryButton>
        </form>
      </BoxContent>
    </Box>
  );
};

export default EnterPasswordForm;
