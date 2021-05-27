import React from 'react';
import AccountVisual from '@toolbox/accountVisual';
import LiskAmount from '@shared/liskAmount';
import styles from './transactionInfo.css';

const Send = ({
  fields, token, transaction = {}, t,
}) => (
  <>
    <section>
      <label>{t('Recipient')}</label>
      <label className="recipient-value">
        <AccountVisual address={fields.recipient.address} size={25} />
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
        <label>{t('Transaction ID')}</label>
        <label>
          {transaction.id ? Buffer.from(transaction.id, 'hex') : '-'}
        </label>
      </div>
      <div className={`${styles.col} amount-summary`}>
        <label>{t('Amount')}</label>
        <label>
          <LiskAmount
            val={transaction.asset?.amount}
            token={token}
          />
        </label>
      </div>
    </section>
    <section>
      <label>{t('Message')}</label>
      <label className="recipient-value">
        {transaction.asset?.data}
      </label>
    </section>
  </>
);

export default Send;
