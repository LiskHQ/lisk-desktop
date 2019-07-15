import React from 'react';
import AccountVisual from '../accountVisual';
import styles from './accountsAndDeletegates.css';

const Delegates = ({
  delegates, onSelectedRow, t, rowItemIndex, updateRowItemIndex,
}) => (
  <div className={`${styles.wrapper} delegates`}>
    <header className={`${styles.header} delegates-header`}>
      <label>{t('Account')}</label>
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
          <AccountVisual address={delegate.account.address} size={40} />
          <div className={styles.accountInformation}>
            <div>
              <span className={`${styles.accountTitle} delegate-name`}>
                {delegate.username}
              </span>
            </div>
            <span className={styles.accountSubtitle}>{delegate.account.address}</span>
          </div>
          <span className={styles.accountBalance}>
            <span className={styles.tag}>
              {t('Delegate #{{rank}}', { rank: delegate.rank })}
            </span>
          </span>
        </div>
      ))
    }
    </div>
  </div>
);

export default Delegates;
