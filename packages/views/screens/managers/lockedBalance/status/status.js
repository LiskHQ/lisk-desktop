import React from 'react';
import { PrimaryButton } from '@basics/buttons';
import TransactionResult from '@transaction/components/transactionResult';
import { getTransactionStatus, statusMessages } from '@transaction/components/transactionResult/statusConfig';
import styles from './status.css';

const TransactionStatus = ({ account, transactions, t }) => {
  const status = getTransactionStatus(account, transactions, account.summary.isMultisignature);
  const template = statusMessages(t)[status.code];

  return (
    <div className={`${styles.wrapper} transaction-status`}>
      <TransactionResult
        illustration="default"
        status={status}
        title={template.title}
        message={template.message}
        className={styles.content}
      >
        {template.button && (
          <PrimaryButton
            onClick={template.button.onClick}
            className={`${template.button.className} dialog-close-button`}
          >
            {template.button.title}
          </PrimaryButton>
        )}
      </TransactionResult>
    </div>
  );
};

export default TransactionStatus;
