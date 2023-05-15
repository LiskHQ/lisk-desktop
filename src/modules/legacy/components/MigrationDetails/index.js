import React from 'react';
import { useTranslation } from 'react-i18next';
import CopyToClipboard from 'src/modules/common/components/copyToClipboard';
import Icon from 'src/theme/Icon';
import TokenAmount from '@token/fungible/components/tokenAmount';
import WalletVisualWithAddress from '@wallet/components/walletVisualWithAddress';
import styles from './migrationDetails.css';

const MigrationDetails = ({ wallet, showBalance }) => {
  const { t } = useTranslation();

  return (
    <div className={styles.accountContainer}>
      <div>
        <h5>{t('Old wallet address')}</h5>
        <div className={styles.addressContainer}>
          <WalletVisualWithAddress address={wallet.legacy?.address} truncate={false} />
          <CopyToClipboard
            type="icon"
            value={wallet.legacy?.address}
            copyClassName={styles.copyIcon}
          />
        </div>
        {showBalance && (
          <p className={styles.accountBalance}>
            <span>{`${t('Wallet balance')}: `}</span>
            <TokenAmount val={Number(wallet.legacy?.balance)} isLsk />
          </p>
        )}
      </div>
      <Icon
        name="arrowRightWithStroke"
        className={`${styles.arrow} ${!showBalance && styles.noBalance}`}
      />
      <div>
        <h5>{t('New wallet address')}</h5>
        <div className={styles.addressContainer}>
          <WalletVisualWithAddress address={wallet.summary?.address} truncate="medium" />
          <CopyToClipboard
            type="icon"
            value={wallet.summary?.address}
            copyClassName={styles.copyIcon}
          />
        </div>
        {showBalance && (
          <p className={styles.accountBalance}>
            <span>{`${t('Wallet balance')}: `}</span>
            <TokenAmount val={Number(wallet.token?.[0]?.availableBalance)} isLsk />
          </p>
        )}
      </div>
    </div>
  );
};

export default MigrationDetails;
