import React from 'react';
import { useTranslation } from 'react-i18next';
import CopyToClipboard from '@basics/copyToClipboard';
import Icon from '@basics/icon';
import LiskAmount from '@shared/liskAmount';
import AccountVisualWithAddress from '@wallet/detail/identity/accountVisual/accountVisualWithAddress';
import { tokenMap } from '@token/configuration/tokens';
import styles from './index.css';

const token = tokenMap.LSK.key;

const AccountMigration = ({ wallet, showBalance }) => {
  const { t } = useTranslation();
  return (
    <div className={styles.accountContainer}>s
      <div>
        <h5>{t('Old account')}</h5>
        <div className={styles.addressContainer}>
          <AccountVisualWithAddress address={wallet.legacy?.address} truncate={false} />
          <CopyToClipboard type="icon" value={wallet.legacy?.address} copyClassName={styles.copyIcon} />
        </div>
        {showBalance && (
          <p>
            <span>{`${t('Balance')}: `}</span>
            <LiskAmount val={Number(wallet.legacy?.balance)} token={token} />
          </p>
        )}
      </div>
      <Icon name="arrowRightWithStroke" className={`${styles.arrow} ${!showBalance && styles.noBalance}`} />
      <div>
        <h5>{t('New account')}</h5>
        <div className={styles.addressContainer}>
          <AccountVisualWithAddress address={wallet.summary?.address} truncate="medium" />
          <CopyToClipboard type="icon" value={wallet.summary?.address} copyClassName={styles.copyIcon} />
        </div>
        {showBalance && (
          <p>
            <span>{`${t('Balance')}: `}</span>
            <LiskAmount val={Number(wallet.token?.balance)} token={token} />
          </p>
        )}
      </div>
    </div>
  );
};  

export default AccountMigration;
