import React from 'react';
import { useTranslation } from 'react-i18next';

import WalletVisual from '@wallet/components/walletVisual';
import DownloadJSON from 'src/modules/common/components/DownloadJSON/DownloadJSON';
import { PrimaryButton, SecondaryButton } from 'src/theme/buttons';
import styles from '../RemoveAccount/RemoveAccount.css';

const RemoveConfirmation = ({ account, onRemoveAccount }) => {
  const { t } = useTranslation();

  return (
    <>
      <h1>{t('Remove Account?')}</h1>
      <WalletVisual
        className={styles.avatar}
        address={account?.metadata?.address}
      />
      {account?.metadata?.name && (
      <p className={styles.accountName}>{account?.metadata?.name}</p>
      )}
      <p className={styles.accountAddress}>{account?.metadata?.address}</p>
      <p className={styles.subheader}>
        {t(
          'This account will no longer be stored on this device. You can backup your secret recovery phrase before remove it.',
        )}
      </p>
      <DownloadJSON
        fileName="encrypted_secret_recovery_phrase"
        encryptedPhrase={account}
      />
      <div className={styles.buttonRow}>
        <SecondaryButton className={styles.button}>
          {t('Cancel')}
        </SecondaryButton>
        <PrimaryButton className={styles.button} onClick={onRemoveAccount}>{t('Remove now')}</PrimaryButton>
      </div>
    </>
  );
};

export default RemoveConfirmation;
