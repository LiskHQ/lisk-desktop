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
import Icon from '@theme/Icon';
import styles from './HardwareAccountManagerModal.css';

const NR_OF_ACCOUNTS_TO_LOAD = 3;

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
    setNrOfAccounts((prevState) => prevState + NR_OF_ACCOUNTS_TO_LOAD);
  }

  useEffect(() => {
    if (isAppOpen) {
      setNrOfAccounts(NR_OF_ACCOUNTS_TO_LOAD);
    } else {
      setNrOfAccounts(0);
    }
  }, [isAppOpen]);

  return (
    <Dialog className={styles.HardwareAccountManagerModal} hasClose>
      <>
        <h2 className={styles.title}>{t('Import account from hardware wallet')}</h2>
        <div className={styles.accountListWrapper}>
          {hwAccounts?.map((hwAccount) => (
            <AccountRow
              className={styles.accountRowProp}
              key={hwAccount.metadata.address}
              account={hwAccount}
              onSelect={onSelect}
              RightSlot={
                <Icon
                  className={styles.icon}
                  name={hwAccount.metadata.isImported ? 'checkmarkBlue' : 'downloadBlue'}
                />
              }
            />
          ))}
          {!isAppOpen && (
            <p className={styles.warningText}>
              {t('Please open the Lisk app on your hardware wallet device to see your accounts.')}
            </p>
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
