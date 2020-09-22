import React from 'react';
import TransactionResult from '../../../shared/transactionResult';
import { PrimaryButton, SecondaryButton } from '../../../toolbox/buttons';
import { removeSearchParamsFromUrl } from '../../../../utils/searchParams';
import styles from './status.css';

const Status = ({
  t, history, transactions, transactionBroadcasted,
}) => {
  const success = false;
  const displayTemplate = success
    ? {
      title: t('Transaction submitted'),
      message: t('You will find it in your Wallet and it will be confirmed in a matter of seconds'),
    }
    : {
      title: t('Transaction failed'),
      message: t('Something went wrong with the registration. Please try again below!'),
    };

  const onRetry = () => {
    const { broadcastedTransactionsError } = transactions;

    broadcastedTransactionsError.forEach(({ transaction }) =>
      transactionBroadcasted(transaction));
  };

  return (
    <div className={`${styles.wrapper} transaction-status`}>
      <TransactionResult
        t={t}
        illustration={success ? 'transactionSuccess' : 'transactionError'}
        success={success}
        title={displayTemplate.title}
        message={displayTemplate.message}
        className={styles.content}
      >
        {
          !success
            ? (
              <SecondaryButton
                className="on-retry"
                onClick={onRetry}
              >
                {t('Try again')}
              </SecondaryButton>
            )
            : (
              <PrimaryButton
                onClick={() => {
                  removeSearchParamsFromUrl(history, ['modal'], true);
                }}
              >
                {t('Back to Wallet')}
              </PrimaryButton>
            )
        }
      </TransactionResult>
    </div>
  );
};

export default Status;
