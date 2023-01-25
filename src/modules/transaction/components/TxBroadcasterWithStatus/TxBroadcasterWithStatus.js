import React from 'react';
import { PrimaryButton } from 'src/theme/buttons';
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

export default TxBroadcasterWithStatus;
