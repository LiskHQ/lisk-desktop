import React, { useState, useEffect } from 'react';
import { TransactionResult } from '@shared/transactionResult';
import { isEmpty } from '@utils/helpers';
import DelegateAnimation from '../animations/delegateAnimation';
import statusMessages from './statusMessages';
import styles from './status.css';

const Status = ({
  transactions, account, t,
  transactionBroadcasted, resetTransactionResult,
}) => {
  const [status, setStatus] = useState('pending');
  const isConfirmed = !!account.dpos.delegate;
  const template = statusMessages(t)[status];

  useEffect(() => {
    if (!isEmpty(transactions.signedTransaction) && !transactions.txSignatureError) {
      /**
       * Broadcast the successfully signed tx
       */
      transactionBroadcasted(transactions.signedTransaction);
    }

    return resetTransactionResult;
  }, []);

  useEffect(() => {
    if (transactions.txBroadcastError) {
      setStatus('error');
    } else if (isConfirmed) {
      setStatus('success');
    }
  }, [transactions.txBroadcastError]);

  return (
    <div className={`${styles.wrapper} status-container`}>
      <TransactionResult
        illustration={(
          <DelegateAnimation
            className={styles.animation}
            status={status}
            onLoopComplete={() => {}}
          />
        )}
        status={{ code: status }}
        title={template.title}
        message={template.message}
        className={styles.content}
        t={t}
      />
    </div>
  );
};

export default Status;
