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
        <WalletVisual address={transaction.asset.recipient} size={25} />
        <label className={`${styles.information} recipient-confirm`}>
          {transaction.asset.recipient}
        </label>
        { transaction.asset.recipient ? (
          <span className={styles.secondText}>
            {transaction.asset.recipient}
          </span>
        ) : null }
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
        {transaction.asset?.data || '-'}
      </label>
    </section>
  </>
);

export default Send;
