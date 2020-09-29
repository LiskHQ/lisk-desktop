import React, { useState, useEffect } from 'react';
import TransactionResult from '../../../shared/transactionResult';
import { removeSearchParamsFromUrl } from '../../../../utils/searchParams';
import DelegateAnimation from '../../registerDelegate/animations/delegateAnimation';
import styles from './status.css';

const Status = ({
  t, history, transactions, transactionBroadcasted,
}) => {
  const [status, setStatus] = useState('pending');
  const { transactionsCreated } = transactions;
  const success = status !== 'fail';
  const checkTransactionStatus = () => {
    // TODO refactor this
    const transactionInfo = {}; // get from props

    const isSuccess = transactions.confirmed
      .filter(tx => tx.id === transactionInfo.id);
    const error = transactions.broadcastedTransactionsError
      .filter(tx => tx.transaction.id === transactionInfo.id);

    if (isSuccess.length) setStatus('ok');
    if (error.length) setStatus('fail');
  };

  const displayTemplate = success
    ? {
      title: t('Transaction submitted'),
      message: t('You will find it in your Wallet and it will be confirmed in a matter of seconds'),
      button: {
        onClick: () => {
          removeSearchParamsFromUrl(history, ['modal'], true);
        },
        title: t('Back to Wallet'),
        className: 'close-modal',
      },
    }
    : {
      title: t('Transaction failed'),
      message: t('Something went wrong with the registration. Please try again below!'),
      button: {
        onClick: () => {
          const { broadcastedTransactionsError } = transactions;
          broadcastedTransactionsError.forEach(({ transaction }) =>
            transactionBroadcasted(transaction));
        },
        title: t('Try again'),
        className: 'on-retry',
      },
    };

  useEffect(() => {
    if (transactionsCreated.length) {
      transactionBroadcasted(transactionsCreated[0]);
    }
  }, [transactionsCreated.length]);

  return (
    <div className={`${styles.wrapper} transaction-status`}>
      <TransactionResult
        t={t}
        illustration={(
          <DelegateAnimation
            className={styles.animation}
            status={status}
            onLoopComplete={checkTransactionStatus}
          />
        )}
        success={success}
        title={displayTemplate.title}
        message={displayTemplate.message}
        className={styles.content}
        primaryButon={displayTemplate.button}
      />
    </div>
  );
};

export default Status;
