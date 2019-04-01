import React from 'react';
import AccountVisual from '../accountVisual';
import { fromRawLsk } from '../../utils/lsk';
import styles from './accountsAndDeletegates.css';

const Accounts = ({ accounts, onSelectedRow, t }) => (
  <div className={`${styles.wrapper} accounts`}>
    <header className={`${styles.header} accounts-header`}>
      <label>{t('Accounts')}</label>
      <div className={`${styles.subTitles} accounts-subtitle`}>
        <label>{t('Address')}</label>
        <label>{t('Balance')}</label>
      </div>
    </header>
    <div className={`${styles.content} account-content`}>
    {
      accounts.map((account, index) => (
        <div
          key={index}
          className={`${styles.accountRow} account-row`}
          onClick={() => onSelectedRow(account.address, 'account')}
        >
          <AccountVisual address={account.address} size={30} />
          <div className={styles.accountInformation}>
            <span className={`${styles.accountTitle} account-title`}>
              {account.title ? account.title : account.address}
            </span>
            {
              account.title
              ? <span className={`${styles.accountTitle} account-subtitle`}>{account.address}</span>
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
