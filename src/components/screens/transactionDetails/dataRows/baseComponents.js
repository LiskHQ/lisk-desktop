import React from 'react';

import CopyToClipboard from '../../../toolbox/copyToClipboard';
import TransactionTypeFigure from '../../../shared/transactionTypeFigure';
import { tokenMap } from '../../../../constants/tokens';
import { DateTimeFromTimestamp } from '../../../toolbox/timestamp';
import DiscreetMode from '../../../shared/discreetMode';
import LiskAmount from '../../../shared/liskAmount';
import transactionTypes from '../../../../constants/transactionTypes';
import { getTxAmount } from '../../../../utils/transactions';

import AccountInfo from './accountInfo';
import styles from './styles.css';

const getDelegateName = (transaction, activeToken) => (
  (activeToken === 'LSK'
  && transaction.asset
  && transaction.asset.delegate
  && transaction.asset.delegate.username) ? transaction.asset.delegate.username : null
);

const getTxAsset = (tx) => {
  if (typeof tx.asset === 'object' && tx.asset !== null && typeof tx.asset.data === 'string') {
    return tx.asset.data;
  }
  return '-';
};

export const Illustration = ({
  transaction,
}) => {
  const { title } = transactionTypes.getByCode(transaction.type || 0);
  if (transaction.type === transactionTypes().transfer.code.legacy) return null;
  return (
    <>
      <TransactionTypeFigure
        address={transaction.senderId}
        transactionType={transaction.type}
      />
      <h2 className="tx-header">{title}</h2>
    </>
  );
};

export const Sender = ({
  transaction, activeToken, netCode,
}) => {
  const { senderLabel } = transactionTypes.getByCode(transaction.type || 0);
  return (
    <AccountInfo
      name={getDelegateName(transaction, activeToken)}
      token={activeToken}
      netCode={netCode}
      address={transaction.senderId}
      addressClass="sender-address"
      label={senderLabel}
    />
  );
};

export const Recipient = ({
  activeToken, netCode, transaction, t,
}) => {
  if (transaction.type !== transactionTypes().transfer.code.legacy) return null;
  return (
    <AccountInfo
      token={activeToken}
      netCode={netCode}
      address={transaction.recipientId}
      addressClass="receiver-address"
      label={t('Recipient')}
    />
  );
};

export const TransactionId = ({ id, t }) => (
  <div className={`${styles.value}`}>
    <span className={styles.label}>
      {t('Transaction ID')}
    </span>
    <span className="transaction-id">
      <CopyToClipboard
        value={id}
        className="tx-id"
        containerProps={{
          size: 'xs',
          className: 'copy-title',
        }}
        copyClassName={styles.copyIcon}
      />
    </span>
  </div>
);

export const Message = ({
  activeToken, transaction, t,
}) => {
  if (transaction.type !== transactionTypes().transfer.code.legacy
    || activeToken !== tokenMap.LSK.key) return null;
  return (
    <div className={styles.value}>
      <span className={styles.label}>{t('Message')}</span>
      <div className="tx-reference">
        {getTxAsset(transaction)}
      </div>
    </div>
  );
};

export const Amount = ({
  t, transaction, addresses, activeToken,
}) => (
  <div className={styles.value}>
    <span className={styles.label}>
      {t('Amount of Transaction')}
    </span>
    <DiscreetMode addresses={addresses} shouldEvaluateForOtherAccounts>
      <span className="tx-amount">
        <LiskAmount val={getTxAmount(transaction)} />
        {' '}
        {activeToken}
      </span>
    </DiscreetMode>
  </div>
);

export const Date = ({ t, timestamp, activeToken }) => (
  <div className={styles.value}>
    <span className={styles.label}>{t('Date')}</span>
    <span className={`${styles.date} tx-date`}>
      <DateTimeFromTimestamp
        fulltime
        className="date"
        time={timestamp}
        token={activeToken}
        showSeconds
      />
    </span>
  </div>
);

export const Fee = ({ t, fee, activeToken }) => (
  <div className={styles.value}>
    <span className={styles.label}>
      {t('Transaction fee')}
    </span>
    <span className="tx-fee">
      <LiskAmount val={fee} />
      {' '}
      {activeToken}
    </span>
  </div>
);
