import React from 'react';
import TransactionResult from '@shared/transactionResult';
import { statusMessages, getTransactionStatus } from '@shared/transactionResult/statusConfig';
import LiskAmount from '@shared/liskAmount';
import { PrimaryButton } from '@toolbox/buttons';
import { tokenMap } from '@constants';
import Spinner from '@toolbox/spinner';
import styles from './status.css';

const SuccessAction = ({
  template, isMigrated, balance, t,
}) => (
  <>
    <ul className={styles.successList}>
      <li>
        <span>
          <LiskAmount
            val={Number(balance)}
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
  </>
);

const PendingAction = ({ template }) => (
  <p className="transaction-status body-message">{template.message}</p>
);

const Status = ({
  t, transactions, balance, isMigrated,
}) => {
  const status = getTransactionStatus(transactions);
  const template = statusMessages(t)[status.code];

  return (
    <div className={`${styles.wrapper} status-container`}>
      <TransactionResult
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
