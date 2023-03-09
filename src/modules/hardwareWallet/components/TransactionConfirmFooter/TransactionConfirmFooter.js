import React from 'react';
import classNames from 'classnames';
import WalletVisual from '@wallet/components/walletVisual';
import { useCurrentAccount } from '@account/hooks';
import styles from './TransactionConfirmFooter.css';

export function TransactionConfirmFooter({ className }) {
  const [currentAccount] = useCurrentAccount();
  const { name, address } = currentAccount.metadata;

  return (
    <div className={classNames(styles.TransactionConfirmFooter, className)}>
      <WalletVisual address={address} size={32} />
      <div className={styles.name}>
        <span>{name}</span>
      </div>
      <div className={styles.address}>
        <span>{address}</span>
      </div>
    </div>
  );
}
