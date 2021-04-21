import React from 'react';
import { withTranslation } from 'react-i18next';
import CopyToClipboard from '@toolbox/copyToClipboard';
import Icon from '@toolbox/icon';
import LiskAmount from '@shared/liskAmount';
import AccountVisualWithAddress from '@shared/accountVisualWithAddress';
import styles from './index.css';

const AccountMigration = ({ t, account, showBalance }) => (
  <div className={styles.accountContainer}>
    <div>
      <h5>{t('Old account')}</h5>
      <div className={styles.addressContainer}>
        <AccountVisualWithAddress address={account.legacy?.address} truncate={false} />
        <CopyToClipboard type="icon" value={account.legacy?.address} copyClassName={styles.copyIcon} />
      </div>
      {showBalance && (
        <p>
          <span>{`${t('Balance')}: `}</span>
          <LiskAmount val={parseInt(account.legacy?.balance, 10)} token="LSK" />
        </p>
      )}
    </div>
    <Icon name="arrowRightWithStroke" className={`${styles.arrow} ${!showBalance && styles.noBalance}`} />
    <div>
      <h5>{t('New account')}</h5>
      <div className={styles.addressContainer}>
        <AccountVisualWithAddress address={account.summary?.address} truncate={false} />
        <CopyToClipboard type="icon" value={account.summary?.address} copyClassName={styles.copyIcon} />
      </div>
      {showBalance && (
        <p>
          <span>{`${t('Balance')}: `}</span>
          <LiskAmount val={parseInt(account.token?.balance, 10)} token="LSK" />
        </p>
      )}
    </div>
  </div>
);

export default withTranslation()(AccountMigration);
