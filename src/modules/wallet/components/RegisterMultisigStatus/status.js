import React from 'react';
import { useSelector } from 'react-redux';
import TxBroadcaster from '@transaction/components/TxBroadcaster';
import { statusMessages, getTransactionStatus } from '@transaction/configuration/statusConfig';
import { selectModuleCommandSchemas } from 'src/redux/selectors';

import ProgressBar from '../RegisterMultisigView/ProgressBar';
import styles from './styles.css';

const Status = ({ account, transactions, t, authQuery }) => {
  const moduleCommandSchemas = useSelector(selectModuleCommandSchemas);
  const status = getTransactionStatus(account, transactions, { moduleCommandSchemas });
  const template = statusMessages(t)[status.code];
  const numberOfSignaturesOnAccount = authQuery.data?.data?.numberOfSignatures;

  return (
    <section className={`${styles.wrapper} transaction-status`}>
      <div className={styles.header}>
        <h1>
          {t(`${numberOfSignaturesOnAccount > 1 ? 'Edit' : 'Register'} multisignature account`)}
        </h1>
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
