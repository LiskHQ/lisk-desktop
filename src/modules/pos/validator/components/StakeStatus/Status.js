import React from 'react';

import TxBroadcaster from '@transaction/components/TxBroadcaster';
import { getTransactionStatus } from '@transaction/configuration/statusConfig';
import { txStatusTypes } from '@transaction/configuration/txStatus';
import { useCommandSchema } from '@network/hooks';

import statusMessages from './statusMessages';
import styles from './styles.css';
import StakeSuccessfulModal from '../StakeSuccessfulModal';

const Status = ({ account, transactions, statusInfo, t, posToken, formProps }) => {
  const { moduleCommandSchemas } = useCommandSchema();
  const status = getTransactionStatus(account, transactions, { moduleCommandSchemas });
  const template = statusMessages(t, statusInfo, posToken, formProps)[status.code];

  return (
    <div className={styles.container}>
      {status.code === txStatusTypes.broadcastSuccess ? (
        <StakeSuccessfulModal statusMessage={template} />
      ) : (
        <TxBroadcaster
          title={template.title}
          illustration="stake"
          status={status}
          message={template.message}
          transactions={transactions}
        />
      )}
    </div>
  );
};

export default Status;
