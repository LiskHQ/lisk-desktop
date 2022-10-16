import React from 'react';
import TxBroadcaster from '@transaction/components/TxBroadcaster';
import { getTransactionStatus } from '@transaction/configuration/statusConfig';
import statusMessages from './statusMessages';
import styles from './styles.css';
import VoteSuccessfulModal from './VoteSuccessfulModal';

const Status = ({ account, transactions, statusInfo, t, dposToken }) => {
  const status = getTransactionStatus(account, transactions, account?.summary.isMultisignature);
  const template = statusMessages(t, statusInfo)[status.code];

  return (
    <div className={styles.container}>
      {status.code !== 'BROADCAST_SUCCESS' ? (
        <VoteSuccessfulModal statusInfo={statusInfo} dposToken={dposToken} />
      ) : (
        <TxBroadcaster
          title={template.title}
          illustration="vote"
          status={status}
          message={template.message}
        />
      )}
    </div>
  );
};

export default Status;
