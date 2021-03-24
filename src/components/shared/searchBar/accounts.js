import React, { Fragment } from 'react';
import AccountVisual from '../../toolbox/accountVisual';
import styles from './accountsAndDeletegates.css';

const Accounts = ({
  accounts, onSelectedRow, t, rowItemIndex, updateRowItemIndex,
}) => {
  const isDelegate = accounts.some(account => account.dpos?.isDelegate);

  return (
    <div className={`${styles.wrapper} accounts`}>
      <header className={`${styles.header} accounts-header`}>
        <label>{t('Account')}</label>
      </header>
      <div className={`${styles.content} account-content`}>
        {
        accounts.map((account, index) => (
          <div
            key={index}
            data-index={index}
            className={`${styles.accountRow} ${rowItemIndex === index ? styles.active : ''} account-row`}
            onClick={() => onSelectedRow(account.summary?.address)}
            onMouseEnter={updateRowItemIndex}
          >
            <AccountVisual address={account.summary?.address} />
            <div className={styles.accountInformation}>
              {
                isDelegate
                  ? (
                    <Fragment>
                      <div>
                        <span className={`${styles.accountTitle} account-title`}>
                          {account.dpos?.delegate.username}
                        </span>
                      </div>
                      <span className={styles.accountSubtitle}>{account.summary?.address}</span>
                    </Fragment>
                  )
                  : (
                    <span className={`${styles.accountTitle} account-title`}>
                      {account.summary?.address}
                    </span>
                  )
              }
            </div>
            <span className={styles.accountBalance}>
              {isDelegate
                ? (
                  <span className={`${styles.tag} tag`}>
                    {t('Delegate #{{rank}}', { rank: account.dpos?.delegate.rank })}
                  </span>
                )
                : null }
            </span>
          </div>
        ))
      }
      </div>
    </div>
  );
};

export default Accounts;
