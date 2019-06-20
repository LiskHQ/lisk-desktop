import React, { Fragment } from 'react';
import AccountVisual from '../accountVisual';
import LiskAmount from '../liskAmount';
import styles from './accountsAndDeletegates.css';

const Accounts = ({
  accounts, onSelectedRow, t, rowItemIndex, updateRowItemIndex,
}) => {
  const isDelegate = accounts.some(account => account.delegate);

  return (
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
            data-index={index}
            className={`${styles.accountRow} ${rowItemIndex === index ? styles.active : ''} account-row`}
            onClick={() => onSelectedRow(account.address)}
            onMouseEnter={updateRowItemIndex}
          >
            <AccountVisual address={account.address} size={30} />
            <div className={styles.accountInformation}>
              {
                isDelegate
                  ? <Fragment>
                      <div>
                        <span className={`${styles.accountTitle} account-title`}>
                          {account.delegate.username}
                        </span>
                        <span className={`${styles.tag} tag`}>
                          {`#${account.delegate.rank} ${t('Delegate')}`}
                        </span>
                      </div>
                      <span className={styles.accountSubtitle}>{account.address}</span>
                    </Fragment>
                  : <span className={`${styles.accountTitle} account-title`}>
                      {account.address}
                    </span>
              }
            </div>
            <span className={styles.accountBalance}>
              <LiskAmount val={account.balance} />
              <span>{t(' LSK')}</span>
            </span>
          </div>
        ))
      }
      </div>
    </div>
  );
};

export default Accounts;
