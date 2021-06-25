import React, { useEffect } from 'react';
import TransactionResult from '@shared/transactionResult';
import LiskAmount from '@shared/liskAmount';
import { PrimaryButton } from '@toolbox/buttons';
import { routes, tokenMap } from '@constants';
import Spinner from '@toolbox/spinner';
import styles from './status.css';

// @todo fix consistent return
const getTransactionError = (txBroadcastError, createError) => {
  if (createError) {
    return createError;
  }

  const error = txBroadcastError !== null
    && JSON.stringify(txBroadcastError);

  return error;
};

// eslint-disable-next-line max-statements
const Status = ({
  t, transactionBroadcasted, transactions,
  transactionInfo, history, transactionError,
  balance, isMigrated,
}) => {
  const broadcastTransaction = () => {
    if (transactionInfo) {
      transactionBroadcasted(transactionInfo);
    }
  };

  const onRetry = () => {
    broadcastTransaction();
  };

  useEffect(() => {
    if (transactionInfo) broadcastTransaction();
  }, []);

  const isTransactionSuccess = transactions.txBroadcastError === null
    && !transactionError;

  const displayTemplate = isTransactionSuccess
    ? {
      title: t('Done!'),
      message: t('Your balance will be transfered in a few seconds.'),
      button: {
        onClick: () => {
          history.push(routes.wallet.path);
        },
        title: t('Go to wallet'),
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
        t={t}
        illustration={isTransactionSuccess ? 'transactionSuccess' : 'transactionError'}
        success={isTransactionSuccess}
        title={displayTemplate.title}
        className={`${styles.content} ${!isTransactionSuccess && styles.error}`}
        error={getTransactionError(transactions.txBroadcastError, transactionError)}
      >
        {isTransactionSuccess
          ? (
            <>
              <ul className={styles.successList}>
                <li>
                  <span>
                    <LiskAmount
                      val={parseInt(balance, 10)}
                      token={tokenMap.LSK.key}
                    />
                    {' '}
                    {t('was deposited on your account')}
                  </span>
                </li>
                <li><span>{t('Reclaim transaction was sent')}</span></li>
              </ul>
              <p className="transaction-status body-message">{displayTemplate.message}</p>
              <PrimaryButton
                className={`${styles.btn} ${displayTemplate.button.className}`}
                onClick={displayTemplate.button.onClick}
                disabled={!isMigrated}
              >
                {displayTemplate.button.title}
                <Spinner completed={isMigrated} className={styles.spinner} />
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
          )}
      </TransactionResult>
    </div>
  );
};

export default Status;
