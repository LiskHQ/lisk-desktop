import React from 'react';
import Box from 'src/theme/box';
import TransactionResult from '@transaction/manager/transactionResult';
import { getTransactionStatus } from '@transaction/configuration/statusConfig';
import ToggleIcon from '../toggleIcon';
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
    <section className="ali">
      <Box className={styles.container}>
        <header className={styles.header}>
          <ToggleIcon />
        </header>
        <TransactionResult
          title={template.title}
          illustration="vote"
          status={status}
          message={template.message}
        />
      </Box>
    </section>
  );
};

export default Status;
