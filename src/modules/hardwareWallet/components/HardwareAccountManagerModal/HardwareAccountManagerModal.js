import React, { useEffect, useState } from 'react';
import Dialog from '@theme/dialog/dialog';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useCurrentAccount } from '@account/hooks';
import { updateHWAccount } from '@hardwareWallet/store/actions';
import Spinner from '@theme/Spinner';
import AccountRow from '@account/components/AccountRow';
import { TertiaryButton } from '@theme/buttons';
import useHWAccounts from '@hardwareWallet/hooks/useHWAccounts';
import { selectCurrentHWDevice } from '@hardwareWallet/store/selectors/hwSelectors';
import styles from './HardwareAccountManagerModal.css';

// eslint-disable-next-line max-statements
function HardwareAccountManagerModal() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [, setCurrentAccount] = useCurrentAccount();

  const [nrOfAccounts, setNrOfAccounts] = useState(0);
  const { hwAccounts, isLoading } = useHWAccounts(nrOfAccounts);

  const currentHWDevice = useSelector(selectCurrentHWDevice);
  const { isAppOpen } = currentHWDevice;

  function onSelect(account) {
    dispatch(updateHWAccount(account));
    setCurrentAccount(account);
  }

  function onLoadMore() {
    setNrOfAccounts((prevState) => prevState + 3);
  }

  useEffect(() => {
    if (isAppOpen) {
      setNrOfAccounts(3);
    }
  }, [isAppOpen]);

  return (
    <Dialog className={styles.HardwareAccountManagerModal}>
      <>
        <h2 className={styles.title}>{t('Import account from hardware wallet')}</h2>
        <div className={styles.accountListWrapper}>
          {hwAccounts?.map((hwAccount) => (
            <AccountRow key={hwAccount.metadata.address} account={hwAccount} onSelect={onSelect} />
          ))}
          {!isAppOpen && (
            <p>{t('Please open the Lisk app on your ledger device to see your accounts')}</p>
          )}
        </div>
        {isLoading && (
          <div className={styles.loaderWrapper}>
            <Spinner className={styles.spinner} />
            <span>{t('Loading hardware wallet accounts…')}</span>
          </div>
        )}
        {isAppOpen && (
          <TertiaryButton className={styles.loadMoreBtn} onClick={onLoadMore} disabled={isLoading}>
            {t('Load more')}
          </TertiaryButton>
        )}
      </>
    </Dialog>
  );
}

export default HardwareAccountManagerModal;
