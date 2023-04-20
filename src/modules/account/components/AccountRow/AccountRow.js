import React from 'react';
import Icon from 'src/theme/Icon';
import { truncateAddress } from '@wallet/utils/account';
import WalletVisual from '@wallet/components/walletVisual';
import Tooltip from '@theme/Tooltip';
import { useTranslation } from 'react-i18next';
import styles from './AccountRow.css';

function AccountRow({ account, currentAccount, onSelect, onRemove, truncate }) {
  const {
    metadata: { name, address, isHW, isNew },
  } = account;
  const isCurrentAccount = currentAccount?.metadata?.address === address;
  const { t } = useTranslation();
  return (
    <div
      key={address}
      data-testid={address}
      className={styles.accountWrapper}
      onClick={() => onSelect(account)}
    >
      <WalletVisual address={address} size={40} />
      <div className={styles.addressWrapper}>
        <div className={styles.header}>
          <b className={`${styles.addressValue}`}>
            <span>{name}</span> {isHW && <Icon name="hardwareWalletIcon" />}
          </b>
          {isHW && isNew && (
            <div>
              <span className={styles.new}>{t('New')}</span>
              <Tooltip size="m" tooltipClassName={`${styles.tooltipContainer}`} position="left">
                <p>
                  {t(
                    'Transfer tokens to the uninitialized new account to utilize all the wallet features. At any given time, only one uninitialized account can be created.'
                  )}
                </p>
              </Tooltip>
            </div>
          )}
        </div>
        <p className={`${styles.addressValue}`}>{truncate ? truncateAddress(address) : address}</p>
      </div>
      {isCurrentAccount && (
        <div className={styles.currentAccountIcon}>
          <Icon name="checkboxCircleFilled" />
        </div>
      )}
      {onRemove && (
        <button
          data-testid={`${address}-delete`}
          onClick={(event) => {
            event.stopPropagation();
            onRemove(account);
          }}
        >
          <Icon name="deleteRedIcon" />
        </button>
      )}
    </div>
  );
}

export default AccountRow;
