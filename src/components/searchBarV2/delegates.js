import React from 'react';
import AccountVisual from '../accountVisual';
import LiskAmount from '../liskAmount';
import styles from './accountsAndDeletegates.css';

const Delegates = ({
  delegates, onSelectedRow, t, rowItemIndex, updateRowItemIndex,
}) => (
  <div className={`${styles.wrapper} delegates`}>
    <header className={`${styles.header} delegates-header`}>
      <label>{t('Accounts')}</label>
      <div className={`${styles.subTitles} delegates-subtitle`}>
        <label>{t('Address')}</label>
        <label>{t('Vote Weights')}</label>
      </div>
    </header>
    <div className={`${styles.content} delegates-content`}>
    {
      delegates.map((delegate, index) => (
        <div
          key={index}
          data-index={index}
          className={`${styles.accountRow} ${rowItemIndex === index ? styles.active : ''} delegates-row`}
          onClick={() => onSelectedRow(delegate.account.address)}
          onMouseEnter={updateRowItemIndex}
        >
          <AccountVisual address={delegate.account.address} size={30} />
          <div className={styles.accountInformation}>
            <div>
              <span className={`${styles.accountTitle} delegate-name`}>
                {delegate.username}
              </span>
              <span className={styles.tag}>
                {`#${delegate.rank} ${t('Delegate')}`}
              </span>
            </div>
            <span className={styles.accountSubtitle}>{delegate.account.address}</span>
          </div>
          <span className={styles.accountBalance}>
            <LiskAmount val={delegate.vote} />
            <span>{t(' LSK')}</span>
          </span>
        </div>
      ))
    }
    </div>
  </div>
);

export default Delegates;
