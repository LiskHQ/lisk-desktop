import React from 'react';
import AccountVisual from '../../accountVisual';
import styles from './transactionDetailViewV2.css';

const AccountInfo = ({ address, label }) => (
  <div className={styles.accountInfo}>
    <AccountVisual address={address} size={36} />
    <div>
      <p className={styles.label}>{label}</p>
      <p className={styles.address}>{address}</p>
    </div>
  </div>
);

export default AccountInfo;
