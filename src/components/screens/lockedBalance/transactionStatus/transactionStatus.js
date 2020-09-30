import React, { useState, useEffect } from 'react';
import { PrimaryButton } from '../../../toolbox/buttons';
import TransactionResult from '../../../shared/transactionResult';
import { removeSearchParamsFromUrl } from '../../../../utils/searchParams';
import styles from './status.css';

const Status = ({
  t, history, transactions, transactionBroadcasted,
}) => {
  const [status, setStatus] = useState('pending');
  const {
    transactionsCreated,
    confirmed,
    pending,
    broadcastedTransactionsError,
  } = transactions;
  const success = status !== 'fail';

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

  useEffect(() => {
    if (!pending.length && !transactionsCreated.length) {
      setStatus('ok');
    }
  }, [confirmed.length]);

  useEffect(() => {
    if (broadcastedTransactionsError.length) {
      setStatus('fail');
    }
  }, [broadcastedTransactionsError.length]);

  return (
    <div className={`${styles.wrapper} transaction-status`}>
      <TransactionResult
        t={t}
        illustration={success ? 'transactionSuccess' : 'transactionError'}
        success={success}
        title={displayTemplate.title}
        message={displayTemplate.message}
        className={styles.content}
        primaryButon={displayTemplate.button}
      >
        {status !== 'pending' && (
          <PrimaryButton
            onClick={displayTemplate.button.onClick}
            className={displayTemplate.button.className}
          >
            {displayTemplate.button.title}
          </PrimaryButton>
        )
        }
      </TransactionResult>
    </div>
  );
};

export default Status;
