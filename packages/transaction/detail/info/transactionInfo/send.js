import React from 'react';
import WalletVisual from '@wallet/detail/identity/walletVisual';
import LiskAmount from '@shared/liskAmount';
import { toRawLsk } from '@token/utilities/lsk';
import styles from './transactionInfo.css';

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
          <LiskAmount
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
