import React from 'react';
import WalletVisual from '@wallet/components/walletVisual';
import TokenAmount from '@token/fungible/components/tokenAmount';
import usePosToken from '@pos/validator/hooks/usePosToken';
import styles from './UnlockBalance.css';

const UnlockBalance = ({ account, t, formProps }) => {
  const { token } = usePosToken();
  
  return (
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
            <TokenAmount val={formProps.unlockableAmount} token={token} />
          </label>
        </div>
      </section>
    </>
  );
};

export default UnlockBalance;
