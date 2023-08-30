import React, { useState } from 'react';
import Dialog from '@theme/dialog/dialog';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useCurrentAccount } from '@account/hooks';
import { updateHWAccount } from '@hardwareWallet/store/actions';
import Spinner from '@theme/Spinner';
import AccountRow from '@account/components/AccountRow';
import { TertiaryButton } from '@theme/buttons';
import useHWAccounts from '@hardwareWallet/hooks/useHWAccounts';
import styles from './HardwareAccountManagerModal.css';

function HardwareAccountManagerModal() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [nrOfAccounts, setNrOfAccounts] = useState(3);

  const { hwAccounts, isLoading } = useHWAccounts(nrOfAccounts);
  const [, setCurrentAccount] = useCurrentAccount();

  function onSelect(account) {
    dispatch(updateHWAccount(account));
    setCurrentAccount(account);
  }

  function onLoadMore() {
    setNrOfAccounts((prevState) => prevState + 3);
  }

  return (
    <Dialog className={styles.HardwareAccountManagerModal}>
      <h2 className={styles.title}>{t('Import account from hardware wallet')}</h2>
      <div className={styles.accountListWrapper}>
        {hwAccounts?.map((hwAccount) => (
          <AccountRow key={hwAccount.metadata.address} account={hwAccount} onSelect={onSelect} />
        ))}
      </div>
      {isLoading && (
        <div className={styles.loaderWrapper}>
          <Spinner className={styles.spinner} />
          <span>{t('Loading hardware wallet accounts…')}</span>
        </div>
      )}
      <TertiaryButton className={styles.loadMoreBtn} onClick={onLoadMore}>
        {t('Load more')}
      </TertiaryButton>
    </Dialog>
  );
}

export default HardwareAccountManagerModal;
