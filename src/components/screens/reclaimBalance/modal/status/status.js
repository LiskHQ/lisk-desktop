import React, { useEffect } from 'react';
import { TransactionResult, getBroadcastStatus } from '@shared/transactionResult';
import LiskAmount from '@shared/liskAmount';
import { PrimaryButton } from '@toolbox/buttons';
import { tokenMap } from '@constants';
import Spinner from '@toolbox/spinner';
import statusMessages from './statusMessages';
import styles from './status.css';

const SuccessAction = ({
  template, isMigrated, balance, t,
}) => (
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
    <p className="transaction-status body-message">{template.message}</p>
    <PrimaryButton
      className={`${styles.btn} ${template.button.className}`}
      onClick={template.button.onClick}
      disabled={!isMigrated}
    >
      {template.button.title}
      <Spinner completed={isMigrated} className={styles.spinner} />
    </PrimaryButton>
  </>
);

const FailAction = ({ template }) => (
  <>
    <p className="transaction-status body-message">{template.message}</p>
    <PrimaryButton
      className={`${styles.btn} ${template.button.className}`}
      onClick={template.button.onClick}
    >
      {template.button.title}
    </PrimaryButton>
  </>
);

const PendingAction = ({ template }) => (
  <p className="transaction-status body-message">{template.message}</p>
);

// eslint-disable-next-line max-statements
const Status = ({
  t, transactionBroadcasted, transactions,
  transactionInfo, history,
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

  const status = getBroadcastStatus(transactions, false); // @todo handle HW errors by #3661
  const template = statusMessages(t, history, onRetry)[status.code];

  return (
    <div className={`${styles.wrapper} status-container`}>
      <TransactionResult
        t={t}
        illustration="default"
        title={template.title}
        className={`${styles.content} ${status.code === 'error' && styles.error}`}
        status={status}
      >
        <>
          {
            status.code === 'success' ? (
              <SuccessAction
                template={template}
                isMigrated={isMigrated}
                balance={balance}
                t={t}
              />
            ) : null
          }
          {
            status.code === 'fail' ? (
              <FailAction template={template} />
            ) : null
          }
          {
            status.code === 'pending' ? (
              <PendingAction template={template} />
            ) : null
          }
        </>
      </TransactionResult>
    </div>
  );
};

export default Status;
