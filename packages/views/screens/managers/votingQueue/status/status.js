import React from 'react';
import Box from '@views/basics/box';
import TransactionResult from '@shared/transactionResult';
import { getTransactionStatus } from '@shared/transactionResult/statusConfig';
import ToggleIcon from '../toggleIcon';
import statusMessages from './statusMessages';
import styles from './styles.css';

const Status = ({
  account, transactions, statusInfo, t,
}) => {
  const status = getTransactionStatus(account, transactions, account?.summary.isMultisignature);
  const template = statusMessages(t, statusInfo)[status.code];

  return (
    <section>
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
