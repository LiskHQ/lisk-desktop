import React from 'react';
import AccountVisual from '../accountVisual';
import styles from './accountsAndDeletegates.css';

const Delegates = props => (
  <div className={`${styles.wrapper} delegates`}>
    <header className={`${styles.header} delegates-header`}>
      <label>{props.t('Accounts')}</label>
      <div className={`${styles.subTitles} delegates-subtitle`}>
        <label>{props.t('Address')}</label>
        <label>{props.t('Vote Weights')}</label>
      </div>
    </header>
    <div className={`${styles.content} delegates-content`}>
    {
      props.delegates.map((delegate, index) => (
        <div
          key={index}
          className={`${styles.accountRow} delegates-row`}
          onClick={() => props.onSelectedRow(delegate.account.address, 'account')}
        >
          <AccountVisual address={delegate.account.address} size={30} />
          <div className={styles.accountInformation}>
            <div>
              <span className={styles.accountTitle}>{delegate.username}</span>
              <span className={styles.tag}>{`#${delegate.rank} ${props.t('Delegate')}`}</span>
            </div>
            <span className={styles.accountSubtitle}>{delegate.rewards}</span>
          </div>
          <span className={styles.accountBalance}>{props.t('{{rewards}} LSK', { rewards: delegate.vote })}</span>
        </div>
      ))
    }
    </div>
  </div>
);

export default Delegates;
