import React from 'react';
import TransactionResult from '@shared/transactionResult';
import { statusMessages, getTransactionStatus } from '@shared/transactionResult/statusConfig';
import ProgressBar from '../progressBar';
import styles from './styles.css';

const Status = ({ account, transactions, t }) => {
  const status = getTransactionStatus(account, transactions);
  const template = statusMessages(t)[status.code];

  return (
    <section className={`${styles.wrapper} transaction-status`}>
      <div className={styles.header}>
        <h1>{t('Register multisignature account')}</h1>
      </div>
      <ProgressBar current={4} />
      <TransactionResult
        illustration="registerMultisignature"
        status={status}
        message={template.message}
        title={template.title}
        className={styles.content}
      />
    </section>
  );
};

export default Status;
