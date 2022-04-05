import React from 'react';
import AccountVisual from '@wallet/detail/info/accountVisual';
import styles from './transactionInfo.css';

const RegisterDelegate = ({ account, username, t }) => (
  <section>
    <label className="username-label">{t('Your username')}</label>
    <div className={styles.userInformation}>
      <AccountVisual
        className={styles.accountVisual}
        address={account.summary?.address}
        size={25}
      />
      <span className={`${styles.username} username`}>{username}</span>
      <span className={`${styles.address} address`}>{account.summary?.address}</span>
    </div>
  </section>
);

export default RegisterDelegate;
