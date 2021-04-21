import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectAccount } from '@store/selectors';
import TransactionResult from '@shared/transactionResult';
import LiskAmount from '@shared/liskAmount';
import { PrimaryButton } from '@toolbox/buttons';
import { routes, tokenMap } from '@constants';
import styles from './status.css';

const Status = ({
  t, transactionBroadcasted,
  transactionInfo, history,
}) => {
  const account = useSelector(selectAccount);
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
      message: t('Your balance will be transfered in a few seconds.'),
      button: {
        onClick: () => {
          history.push(routes.wallet.path);
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
                <li>
                  <span>
                    <LiskAmount
                      val={parseInt(account.info.LSK.legacy.balance, 10)}
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
