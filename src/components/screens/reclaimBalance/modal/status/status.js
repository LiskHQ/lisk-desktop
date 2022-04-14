import React from 'react';
import TransactionResult from '@shared/transactionResult';
import { getTransactionStatus } from '@shared/transactionResult/statusConfig';
import { txStatusTypes } from '@constants';
import statusMessages from './statusMessages';
import styles from './status.css';

const Status = ({
  account, transactions, isMigrated, t,
}) => {
  const status = getTransactionStatus(account, transactions, account.summary.isMultisignature);
  const template = statusMessages(t)[status.code];
  const collisionAttackMessage = t('Failed to process reclaim your legacy balance. You might have been a victim of an address collision attack.');

  if (status.code === txStatusTypes.broadcastError) {
    if (transactions.txBroadcastError?.error?.message) {
      template.message = transactions.txBroadcastError.error.message;
    } else {
      template.message = collisionAttackMessage;
    }
  }

  return (
    <div className={`${styles.wrapper} status-container`}>
      <TransactionResult
        illustration="default"
        status={status}
        title={template.title}
        message={template.message}
        className={styles.content}
        noBackButton={!isMigrated}
      />
    </div>
  );
};

export default Status;
