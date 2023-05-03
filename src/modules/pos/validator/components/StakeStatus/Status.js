import React from 'react';
import { useSelector } from 'react-redux';

import TxBroadcaster from '@transaction/components/TxBroadcaster';
import { getTransactionStatus } from '@transaction/configuration/statusConfig';
import { txStatusTypes } from '@transaction/configuration/txStatus';
import { selectModuleCommandSchemas } from 'src/redux/selectors';

import statusMessages from './statusMessages';
import styles from './styles.css';
import StakeSuccessfulModal from '../StakeSuccessfulModal';

const Status = ({ account, transactions, statusInfo, t, dposToken}) => {
  const moduleCommandSchemas = useSelector(selectModuleCommandSchemas);
  const status = getTransactionStatus(account, transactions, { moduleCommandSchemas });
  const template = statusMessages(t, statusInfo, dposToken)[status.code];

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
