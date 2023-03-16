import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import WalletVisual from '@wallet/components/walletVisual';
import { removeSearchParamsFromUrl } from 'src/utils/searchParams';
import DownloadJSON from 'src/modules/common/components/DownloadJSON/DownloadJSON';
import { PrimaryButton, SecondaryButton } from 'src/theme/buttons';
import { truncateAddress } from '@wallet/utils/account';
import styles from '../RemoveAccount/RemoveAccount.css';

const RemoveConfirmation = ({ history, location, account, onRemoveAccount }) => {
  const { t } = useTranslation();
  const accountName = account?.metadata?.name;
  const appendAccountName = `_${accountName}`;
  const address = truncateAddress(accountName);
  const fileName = `${address}${accountName ? appendAccountName : ''}_lisk_account`;

  const handleCancelDialog = useCallback(() => {
    if (/modal=/g.test(location.hash)) {
      removeSearchParamsFromUrl(history, ['modal'], true);
    } else {
      history.goBack();
    }
  }, [history, location]);

  return (
    <>
      <h1>{t('Remove Account?')}</h1>
      <WalletVisual className={styles.avatar} address={account?.metadata?.address} />
      {account?.metadata?.name && <p className={styles.accountName}>{account?.metadata?.name}</p>}
      <p className={styles.accountAddress}>{account?.metadata?.address}</p>
      <p className={styles.subheader}>
        {t(
          'This account will no longer be stored on this device. You can backup your secret recovery phrase before removing it.'
        )}
      </p>
      <DownloadJSON fileName={fileName} encryptedPhrase={account} />
      <div className={styles.buttonRow}>
        <SecondaryButton className={styles.button} onClick={handleCancelDialog}>
          {t('Cancel')}
        </SecondaryButton>
        <PrimaryButton className={styles.button} onClick={onRemoveAccount}>
          {t('Remove now')}
        </PrimaryButton>
      </div>
    </>
  );
};

export default RemoveConfirmation;
