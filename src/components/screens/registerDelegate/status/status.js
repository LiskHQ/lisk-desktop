import React, { useState, useEffect } from 'react';
import TransactionResult from '@shared/transactionResult';
import { getTransactionStatus, txStatusTypes } from '@shared/transactionResult/statusConfig';
import DelegateAnimation from '../animations/delegateAnimation';
import statusMessages from './statusMessages';
import styles from './status.css';

const Status = ({
  transactions, account, t,
}) => {
  const [animationStatus, setAnimationStatus] = useState('pending');
  const status = getTransactionStatus(transactions);
  const template = statusMessages(t)[status.code];
  const isConfirmed = !!account.dpos.delegate?.username;

  useEffect(() => {
    if (status.code === txStatusTypes.signatureError
      || status.code === txStatusTypes.broadcastError) {
      setAnimationStatus('error');
    } else if (isConfirmed && animationStatus === 'pending') {
      setAnimationStatus('success');
    }
  }, [transactions.txBroadcastError, transactions.signedTransaction]);

  return (
    <div className={`${styles.wrapper} status-container`}>
      <TransactionResult
        illustration={(
          <DelegateAnimation
            className={styles.animation}
            status={animationStatus}
          />
        )}
        status={status}
        title={template.title}
        message={template.message}
        className={styles.content}
      />
    </div>
  );
};

const areEqual = (prev, next) => (
  !next.account.dpos.delegate
  || prev.account.dpos.delegate.username === next.account.dpos.delegate.username
);

export default React.memo(Status, areEqual);
