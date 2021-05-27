import React from 'react';
import AccountVisual from '@toolbox/accountVisual';
import styles from './transactionInfo.css';

const RegisterDelegate = ({ account, nickname, t }) => (
  <section className="summary-container">
    <label className="nickname-label">{t('Your nickname')}</label>
    <div className={styles.userInformation}>
      <AccountVisual
        className={styles.accountVisual}
        address={account.summary?.address}
        size={25}
      />
      <span className={`${styles.nickname} nickname`}>{nickname}</span>
      <span className={`${styles.address} address`}>{account.summary?.address}</span>
    </div>
  </section>
);

export default RegisterDelegate;
