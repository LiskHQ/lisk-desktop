import React from 'react';
import AccountVisual from '../accountVisual';
import styles from './accounts.css';

const Accounts = props => (
  <div className={styles.wrapper}>
    <header className={styles.header}>
      <label>{props.t('Accounts')}</label>
      <div className={styles.subTitles}>
        <label>{props.t('Address')}</label>
        <label>{props.t('Balance')}</label>
      </div>
    </header>
    <div className={styles.content}>
    {
      props.accounts.map((account, index) => (
        <div key={index} className={styles.accountRow}>
          <AccountVisual address={account.address} size={36} />
          <div className={styles.accountInformation}>
            <label className={styles.transactionAddress}>{account.address}</label>
          </div>
          <span className={styles.accountBalance}>{props.t('{{balance}} LSK', { balance: account.balance })}</span>
        </div>
      ))
    }
    </div>
  </div>
);

export default Accounts;
