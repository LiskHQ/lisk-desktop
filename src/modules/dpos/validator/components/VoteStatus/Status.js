import React from 'react';
import Box from 'src/theme/box';
import TxBroadcaster from '@transaction/components/TxBroadcaster';
import { getTransactionStatus } from '@transaction/configuration/statusConfig';
import ToggleIcon from '../ToggleIcon';
import statusMessages from './statusMessages';
import styles from './styles.css';

const Status = ({
  account, transactions, statusInfo, t,
}) => {
  const status = getTransactionStatus(
    account,
    transactions,
    account?.summary.isMultisignature,
  );
  const template = statusMessages(t, statusInfo)[status.code];

  return (
    <Box className={styles.container}>
      <header className={styles.header}>
        <ToggleIcon />
      </header>
      <TxBroadcaster
        title={template.title}
        illustration="vote"
        status={status}
        message={template.message}
      />
    </Box>
  );
};

export default Status;
