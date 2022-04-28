import React from 'react';
import WalletVisual from '@wallet/detail/identity/walletVisual';
import styles from './TransactionInfo.css';

const RegisterDelegate = ({ account, username, t }) => (
  <section>
    <label className="username-label">{t('Your username')}</label>
    <div className={styles.userInformation}>
      <WalletVisual
        className={styles.walletVisual}
        address={account.summary?.address}
        size={25}
      />
      <span className={`${styles.username} username`}>{username}</span>
      <span className={`${styles.address} address`}>{account.summary?.address}</span>
    </div>
  </section>
);

export default RegisterDelegate;
