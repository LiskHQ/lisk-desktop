import React from 'react';
import { PrimaryButton } from 'src/theme/buttons';
import TxBroadcaster from '@transaction/components/TxBroadcaster';
import { getTransactionStatus, statusMessages } from '@transaction/configuration/statusConfig';
import styles from './unlockBalanceStatus.css';

const TransactionStatus = ({ account, transactions, t }) => {
  const status = getTransactionStatus(account, transactions, account.summary.isMultisignature);
  const template = statusMessages(t)[status.code];

  return (
    <div className={`${styles.wrapper} transaction-status`}>
      <TxBroadcaster
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
      </TxBroadcaster>
    </div>
  );
};

export default TransactionStatus;
