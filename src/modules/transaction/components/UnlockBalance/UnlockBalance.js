import React from 'react';
import WalletVisual from '@wallet/components/walletVisual';
import TokenAmount from '@token/fungible/components/tokenAmount';
import { tokenMap } from '@token/fungible/consts/tokens';
import styles from './UnlockBalance.css';

const UnlockBalance = ({ account, t, transaction = {} }) => (
  <>
    <section className={styles.sender}>
      <label>{t('Sender')}</label>
      <label>
        <WalletVisual address={account.summary.address} size={25} />
        <label className={`${styles.address} address-label`}>{account.summary.address}</label>
      </label>
    </section>
    <section className={styles.msignRow}>
      <div className={styles.col}>
        <label>{t('Amount to unlock')}</label>
        <label className="amount-label">
          <TokenAmount
            val={transaction.params.unlockObjects.reduce(
              (total, { amount }) => total + Number(amount),
              0
            )}
            token={tokenMap.LSK.key}
          />
        </label>
      </div>
    </section>
  </>
);

export default UnlockBalance;
