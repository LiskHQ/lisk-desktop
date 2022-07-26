import React from 'react';
import WalletVisual from '@wallet/components/walletVisual';
import TokenAmount from '@token/fungible/components/tokenAmount';
import styles from '../TransactionInfo/TransactionInfo.css';

const Send = ({
  transaction = {}, t, token,
}) => (
  <>
    <section>
      <label>{t('Recipient')}</label>
      <label className="recipient-value">
        <WalletVisual address={transaction.params.recipient} size={25} />
        <label className={`${styles.information} recipient-confirm`}>
          {transaction.params.recipient.title || transaction.params.recipient.address}
        </label>
        { transaction.params.recipient.title ? (
          <span className={styles.secondText}>
            {transaction.params.recipient.address}
          </span>
        ) : null }
      </label>
    </section>
    <section className={styles.msignRow}>
      <div className={styles.col}>
        <label>{t('Amount')}</label>
        <label className="amount-summary">
          <TokenAmount
            val={transaction.params.amount}
            token={token}
          />
        </label>
      </div>
    </section>
    <section>
      <label>{t('Message')}</label>
      <label className="message-value">
        {transaction.params.data || '-'}
      </label>
    </section>
  </>
);

export default Send;
