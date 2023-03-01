import React from 'react';
import { useTranslation } from 'react-i18next';

import TxBroadcaster from '@transaction/components/TxBroadcaster';
import { getTransactionStatus } from '@transaction/configuration/statusConfig';
import statusMessages from './statusMessages';
import styles from './ChangeCommissionStatus.css';

const ChangeCommissionStatus = ({ transactions, account }) => {
  const { t } = useTranslation();
  const status = getTransactionStatus(account, transactions, account.summary.isMultisignature);
  const template = statusMessages(t)[status.code];

  return (
    <div className={`${styles.wrapper} status-container`}>
      <TxBroadcaster
        illustration="default"
        status={status}
        title={template.title}
        message={template.message}
        className={styles.content}
      />
    </div>
  );
};

export default ChangeCommissionStatus;
