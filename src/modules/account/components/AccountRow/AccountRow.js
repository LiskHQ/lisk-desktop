import React from 'react';
import Icon from 'src/theme/Icon';
import WalletVisual from '@wallet/components/walletVisual';
import styles from './AccountRow.css';

function AccountRow({
  account,
  onSelect,
  onRemove,
  showRemove,
}) {
  const { uuid, metadata: { name, address } } = account;

  return (
    <div
      key={uuid}
      data-testid={uuid}
      className={styles.accountWraper}
      onClick={() => onSelect(account)}
    >
      <WalletVisual address={address} size={40} />
      <div align="left">
        <b className={`${styles.addressValue}`}>
          {name}
        </b>
        <p className={`${styles.addressValue}`}>
          {address}
        </p>
      </div>
      {showRemove && (
        <button
          data-testid="delete-icon"
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
