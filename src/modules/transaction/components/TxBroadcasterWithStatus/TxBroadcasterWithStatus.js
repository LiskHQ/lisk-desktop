import React from 'react';
import TxBroadcaster from '@transaction/components/TxBroadcaster';
import { getTransactionStatus, statusMessages } from '@transaction/configuration/statusConfig';
import classNames from 'classnames';
import styles from './TxBroadcasterWithStatus.css';

const TxBroadcasterWithStatus = ({
  className,
  classNameTxBroadcaster,
  account,
  transactions,
  t,
}) => {
  const status = getTransactionStatus(account, transactions, account.summary.isMultisignature);
  const template = statusMessages(t)[status.code];

  return (
    <div className={classNames(styles.TxBroadcasterWithStatus, className)}>
      <TxBroadcaster
        className={classNames(styles.TxBroadcasterProp, classNameTxBroadcaster)}
        illustration="default"
        status={status}
        title={template.title}
        message={template.message}
      />
    </div>
  );
};

export default TxBroadcasterWithStatus;
