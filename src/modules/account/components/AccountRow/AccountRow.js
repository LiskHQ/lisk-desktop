import React from 'react';
import Icon from 'src/theme/Icon';
import { truncateAddress } from '@wallet/utils/account';
import WalletVisual from '@wallet/components/walletVisual';
import styles from './AccountRow.css';

function AccountRow({ account, onSelect, onRemove, truncate }) {
  const {
    metadata: { name, address, isHW },
  } = account;

  return (
    <div
      key={address}
      data-testid={address}
      className={styles.accountWrapper}
      onClick={() => onSelect(account)}
    >
      <WalletVisual address={address} size={40} />
      <div className={styles.addressWrapper}>
        <b className={`${styles.addressValue}`}>
          <span>{name}</span> {isHW && <Icon name="hardwareWalletIcon" />}
        </b>
        <p className={`${styles.addressValue}`}>{truncate ? truncateAddress(address) : address}</p>
      </div>
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
