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
  const isConfirmed = !!account.dpos.delegate?.username;
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
    if (transactions.txBroadcastError && status === 'pending') {
      setStatus('error');
    } else if (isConfirmed && status === 'pending') {
      setStatus('success');
    }
  }, [transactions.txBroadcastError, transactions.signedTransaction]);

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

const areEqual = (prev, next) => (
  !next.account.dpos.delegate
  || prev.account.dpos.delegate?.username === next.account.dpos.delegate?.username
);

export default React.memo(Status, areEqual);
