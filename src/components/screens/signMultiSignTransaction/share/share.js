import React from 'react';
import Box from '@toolbox/box';
import BoxContent from '@toolbox/box/content';
import TransactionResult from '@shared/transactionResult';
import { statusMessages, getTransactionStatus } from '@shared/transactionResult/statusConfig';

import ProgressBar from '../progressBar';
import styles from './styles.css';

const Share = ({
  t, transactions,
}) => {
  const status = getTransactionStatus(transactions);
  const template = statusMessages(t)[status.code];

  return (
    <section>
      <Box className={styles.boxContainer}>
        <header>
          <h1>{t('Sign multisignature transaction')}</h1>
          <p>{t('Provide a signature for a transaction which belongs to a multisignature account.')}</p>
        </header>
        <BoxContent>
          <ProgressBar current={4} />
          <TransactionResult
            message={template.message}
            title={template.title}
            illustration="signMultisignature"
            className={styles.content}
            status={status}
          />
        </BoxContent>
      </Box>
    </section>
  );
};

export default Share;
