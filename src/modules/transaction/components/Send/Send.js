import React from 'react';
import WalletVisual from '@wallet/components/walletVisual';
import TokenAmount from '@token/fungible/components/tokenAmount';
import styles from './send.css';

const Send = ({
  transaction = {}, t, token,
}) => (
  <>
    <section>
      <label>{t('Recipient')}</label>
      <label className={`${styles.userInformation} recipient-value`}>
        <WalletVisual
          className={styles.walletVisual}
          address={transaction.asset.recipient.address}
          size={40}
        />
        <div className={styles.titles}>
          <label className={`${styles.primary} recipient-confirm`}>
            {transaction.asset.recipient.title || transaction.asset.recipient.address}
          </label>
          { transaction.asset.recipient.title ? (
            <span className={styles.secondary}>
              {transaction.asset.recipient.address}
            </span>
          ) : null }
        </div>
      </label>
    </section>
    <section className={styles.msignRow}>
      <div className={styles.col}>
        <label>{t('Amount')}</label>
        <label className="amount-summary">
          <TokenAmount
            val={transaction.asset.amount}
            token={token}
          />
        </label>
      </div>
    </section>
    <section>
      <label>{t('Message')}</label>
      <label className="message-value">
        {transaction.asset.data || '-'}
      </label>
    </section>
  </>
);

export default Send;
