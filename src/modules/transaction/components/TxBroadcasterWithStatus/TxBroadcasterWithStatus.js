import React from 'react';
import TxBroadcaster from '@transaction/components/TxBroadcaster';
import {
  getTransactionStatus,
  isTxStatusError,
  statusMessages,
} from '@transaction/configuration/statusConfig';
import { useCommandSchema } from '@network/hooks';

import classNames from 'classnames';
import styles from './TxBroadcasterWithStatus.css';

const TxBroadcasterWithStatus = ({
  className,
  classNameTxBroadcaster,
  account,
  transactions,
  t,
  prevStep,
}) => {
  const moduleCommandSchemas = useCommandSchema();
  const status = getTransactionStatus(account, transactions, { moduleCommandSchemas });
  const template = statusMessages(t)[status.code];
  const isBroadcastError = isTxStatusError(status.code);

  return (
    <div className={classNames(styles.TxBroadcasterWithStatus, className)}>
      <TxBroadcaster
        className={classNames(styles.TxBroadcasterProp, classNameTxBroadcaster)}
        illustration="default"
        status={status}
        title={template.title}
        message={template.message}
        onRetry={isBroadcastError ? () => prevStep({ step: 0 }) : undefined}
      />
    </div>
  );
};

export default TxBroadcasterWithStatus;
