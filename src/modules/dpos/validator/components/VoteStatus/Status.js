import React from 'react';
import TxBroadcaster from '@transaction/components/TxBroadcaster';
import { getTransactionStatus } from '@transaction/configuration/statusConfig';
import { txStatusTypes } from 'src/modules/transaction/configuration/txStatus';
import statusMessages from './statusMessages';
import styles from './styles.css';
import VoteSuccessfulModal from '../VoteSuccessfulModal';

const Status = ({ account, transactions, statusInfo, t, dposToken }) => {
  const status = getTransactionStatus(account, transactions, account?.summary.isMultisignature);
  const template = statusMessages(t, statusInfo)[status.code];
  console.log("status ::::::", status);
  return (
    <div className={styles.container}>
      {status.code === txStatusTypes.broadcastSuccess ? (
        <VoteSuccessfulModal statusMessage={template} dposToken={dposToken} />
      ) : (
        <TxBroadcaster
          title={template.title}
          illustration="vote"
          status={status}
          message={template.message}
          transactions={transactions}
        />
      )}
    </div>
  );
};

export default Status;
