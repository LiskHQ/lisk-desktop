import React from 'react';
import WalletVisual from '@wallet/detail/identity/walletVisual';
import LiskAmount from '@shared/liskAmount';
import { tokenMap } from '@token/configuration/tokens';
import styles from './UnlockBalance.css';

const UnlockBalance = ({ account, t, transaction = {} }) => (
  <>
    <section className={styles.sender}>
      <label>{t('Sender')}</label>
      <label>
        <WalletVisual address={account.summary.address} size={25} />
        <label className={`${styles.address} address-label`}>
          {account.summary.address}
        </label>
      </label>
    </section>
    <section className={styles.msignRow}>
      <div className={styles.col}>
        <label>{t('Amount to unlock')}</label>
        <label className="amount-label">
          <LiskAmount
            val={transaction.asset.unlockObjects.reduce(
              (total, { amount }) => total + Number(amount), 0,
            )}
            token={tokenMap.LSK.key}
          />
        </label>
      </div>
    </section>
  </>
);

export default UnlockBalance;
