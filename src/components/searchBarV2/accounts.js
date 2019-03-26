import React from 'react';
import AccountVisual from '../accountVisual';
import { fromRawLsk } from '../../utils/lsk';
import styles from './accountsAndDeletegates.css';

const Accounts = props => (
  <div className={`${styles.wrapper} accounts`}>
    <header className={`${styles.header} accounts-header`}>
      <label>{props.t('Accounts')}</label>
      <div className={`${styles.subTitles} accounts-subtitle`}>
        <label>{props.t('Address')}</label>
        <label>{props.t('Balance')}</label>
      </div>
    </header>
    <div className={`${styles.content} account-content`}>
    {
      props.accounts.map((account, index) => (
        <div
          key={index}
          className={`${styles.accountRow} account-row`}
          onClick={() => props.onSelectedRow(account.address, 'account')}
        >
          <AccountVisual address={account.address} size={30} />
          <div className={styles.accountInformation}>
            <span className={styles.accountTitle}>
              {account.title ? account.title : account.address}
            </span>
            {
              account.title
              ? <span className={styles.accountTitle}>{account.address}</span>
              : null
            }
          </div>
          <span className={styles.accountBalance}>{`${fromRawLsk(account.balance)} LSK`}</span>
        </div>
      ))
    }
    </div>
  </div>
);

export default Accounts;
