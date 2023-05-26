import React from 'react';
import { useSelector } from 'react-redux';
import TxBroadcaster from '@transaction/components/TxBroadcaster';
import { getTransactionStatus, statusMessages } from '@transaction/configuration/statusConfig';
import { selectModuleCommandSchemas } from 'src/redux/selectors';

import classNames from 'classnames';
import { txStatusTypes } from '@transaction/configuration/txStatus';
import styles from './TxBroadcasterWithStatus.css';

const TxBroadcasterWithStatus = ({
  className,
  classNameTxBroadcaster,
  account,
  transactions,
  t,
  prevStep,
}) => {
  const moduleCommandSchemas = useSelector(selectModuleCommandSchemas);
  const status = getTransactionStatus(account, transactions, { moduleCommandSchemas });
  const template = statusMessages(t)[status.code];
  const isBroadcastError = status.code === txStatusTypes.broadcastError;

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
