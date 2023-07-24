import React from 'react';
import TxBroadcaster from '@transaction/components/TxBroadcaster';
import { useCommandSchema } from '@network/hooks';
import { getTransactionStatus, isTxStatusError } from '@transaction/configuration/statusConfig';
import statusMessages from './statusMessages';
import styles from './Status.css';

const RegisterValidatorStatus = ({ transactions, account, t, prevStep }) => {
  const { moduleCommandSchemas } = useCommandSchema();
  const status = getTransactionStatus(account, transactions, { moduleCommandSchemas });
  const template = statusMessages(t)[status.code];
  const isBroadcastError = isTxStatusError(status.code);

  return (
    <div className={`${styles.wrapper} status-container`}>
      <TxBroadcaster
        illustration="registerValidator"
        status={status}
        title={template.title}
        message={template.message}
        className={styles.content}
        onRetry={isBroadcastError ? () => prevStep({ step: 0 }) : undefined}
      />
    </div>
  );
};

export default RegisterValidatorStatus;
