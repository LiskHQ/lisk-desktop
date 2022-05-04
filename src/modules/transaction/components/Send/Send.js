import React from 'react';
import WalletVisual from '@wallet/components/walletVisual';
import TokenAmount from '@token/fungible/components/tokenAmount';
import { toRawLsk } from '@token/fungible/utils/lsk';
import styles from '../TransactionInfo/TransactionInfo.css';

const Send = ({
  fields, token, transaction = {}, t,
}) => (
  <>
    <section>
      <label>{t('Recipient')}</label>
      <label className="recipient-value">
        <WalletVisual address={fields.recipient.address} size={25} />
        <label className={`${styles.information} recipient-confirm`}>
          {fields.recipient.title || fields.recipient.address}
        </label>
        { fields.recipient.title ? (
          <span className={styles.secondText}>
            {fields.recipient.address}
          </span>
        ) : null }
      </label>
    </section>
    <section className={styles.msignRow}>
      <div className={styles.col}>
        <label>{t('Amount')}</label>
        <label className="amount-summary">
          <TokenAmount
            val={transaction.asset?.amount || toRawLsk(fields.amount.value)}
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
