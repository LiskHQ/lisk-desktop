import React from 'react';
import { routes } from '@constants';
import { PrimaryButton } from '@toolbox/buttons';
import TransactionResult, { getBroadcastStatus } from '@shared/transactionResult';
import statusMessages from './statusMessages';
import styles from './status.css';

const TransactionStatus = ({
  transactions,
  history,
  t,
}) => {
  const status = getBroadcastStatus(transactions, false); // @todo handle HW errors by #3661
  const onSuccess = () => history.push(routes.wallet.path);
  const template = statusMessages(t, onSuccess)[status.code];

  return (
    <div className={`${styles.wrapper} transaction-status`}>
      <TransactionResult
        t={t}
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
