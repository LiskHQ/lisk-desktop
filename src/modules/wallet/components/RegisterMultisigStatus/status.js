import React from 'react';
import { useCommandSchema } from '@network/hooks';
import TxBroadcaster from '@transaction/components/TxBroadcaster';
import { statusMessages, getTransactionStatus } from '@transaction/configuration/statusConfig';

import ProgressBar from '../RegisterMultisigView/ProgressBar';
import styles from './styles.css';

const Status = ({ account, transactions, t }) => {
  const moduleCommandSchemas = useCommandSchema();
  const status = getTransactionStatus(account, transactions, { moduleCommandSchemas });
  const template = statusMessages(t)[status.code];

  return (
    <section className={`${styles.wrapper} transaction-status`}>
      <div className={styles.header}>
        <h1>{t('Register multisignature account')}</h1>
      </div>
      <ProgressBar current={4} />
      <TxBroadcaster
        illustration="registerMultisignature"
        status={status}
        message={template.message}
        title={template.title}
        className={styles.content}
      />
    </section>
  );
};

export default Status;
