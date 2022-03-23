import React from 'react';
import { withTranslation } from 'react-i18next';
import CopyToClipboard from '@basics/copyToClipboard';
import Icon from '@basics/icon';
import LiskAmount from '@shared/liskAmount';
import AccountVisualWithAddress from '@shared/accountVisualWithAddress';
import { tokenMap } from '@token/configuration';
import styles from './index.css';

const token = tokenMap.LSK.key;

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
          <LiskAmount val={Number(account.legacy?.balance)} token={token} />
        </p>
      )}
    </div>
    <Icon name="arrowRightWithStroke" className={`${styles.arrow} ${!showBalance && styles.noBalance}`} />
    <div>
      <h5>{t('New account')}</h5>
      <div className={styles.addressContainer}>
        <AccountVisualWithAddress address={account.summary?.address} truncate="medium" />
        <CopyToClipboard type="icon" value={account.summary?.address} copyClassName={styles.copyIcon} />
      </div>
      {showBalance && (
        <p>
          <span>{`${t('Balance')}: `}</span>
          <LiskAmount val={Number(account.token?.balance)} token={token} />
        </p>
      )}
    </div>
  </div>
);

export default withTranslation()(AccountMigration);
