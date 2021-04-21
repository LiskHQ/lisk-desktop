import React, { useEffect, useState } from 'react';
import TransactionResult from '@shared/transactionResult';
import { PrimaryButton } from '@toolbox/buttons';
import { routes } from '@constants';
import styles from './status.css';

const Status = ({
  t, transactionBroadcasted,
  transactionInfo, history,
}) => {
  const [status, setStatus] = useState('pending');

  const broadcastTransaction = () => {
    transactionBroadcasted(transactionInfo);
  };

  const onRetry = () => {
    setStatus('pending');
    broadcastTransaction();
  };

  useEffect(() => {
    if (transactionInfo) broadcastTransaction();
  }, []);

  const isTransactionSuccess = status !== 'fail';

  const displayTemplate = isTransactionSuccess
    ? {
      title: t('Done!'),
      message: t('You will be notified when your transaction is confirmed.'),
      button: {
        onClick: () => {
          history.push(routes.dashboard.path);
        },
        title: t('Go to Wallet'),
        className: 'close-modal',
      },
    }
    : {
      title: t('Transaction failed'),
      message: t('There was an error in the transaction. Please try again.'),
      button: {
        onClick: onRetry,
        title: t('Try again'),
        className: 'on-retry',
      },
    };

  return (
    <div className={`${styles.wrapper} status-container`}>
      <TransactionResult
        illustration={isTransactionSuccess ? 'transactionSuccess' : 'transactionError'}
        success={isTransactionSuccess}
        title={displayTemplate.title}
        className={styles.content}
        t={t}
      >
        {isTransactionSuccess
          ? (
            <>
              <ul className={styles.successList}>
                <li>{t('0.1 LSK was deposited on your account')}</li>
                <li>{t('Reclaim transaction was sent')}</li>
              </ul>
              <p className="transaction-status body-message">{displayTemplate.message}</p>
              <PrimaryButton
                className={`${styles.btn} ${displayTemplate.button.className}`}
                onClick={displayTemplate.button.onClick}
              >
                {displayTemplate.button.title}
              </PrimaryButton>
            </>
          )
          : (
            <>
              <p className="transaction-status body-message">{displayTemplate.message}</p>
              <PrimaryButton
                className={`${styles.btn} ${displayTemplate.button.className}`}
                onClick={displayTemplate.button.onClick}
              >
                {displayTemplate.button.title}
              </PrimaryButton>
            </>
          )
        }
      </TransactionResult>
    </div>
  );
};

export default Status;
