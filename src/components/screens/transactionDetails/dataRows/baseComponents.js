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
import Tooltip from '../../../toolbox/tooltip/tooltip';

const getTxAsset = (tx) => {
  if (typeof tx.asset === 'object' && tx.asset !== null && typeof tx.asset.data === 'string') {
    return tx.asset.data;
  }
  return '-';
};

export const ValueAndLabel = ({ label, children }) => (
  <div className={`${styles.value}`}>
    <span className={styles.label}>
      {label}
    </span>
    {children}
  </div>
);

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
  senderId, delegateName, type, activeToken, netCode,
}) => {
  const { senderLabel } = transactionTypes.getByCode(type || 0);
  return (
    <AccountInfo
      name={delegateName}
      token={activeToken}
      netCode={netCode}
      address={senderId}
      addressClass="sender-address"
      label={senderLabel}
    />
  );
};

export const Recipient = ({
  activeToken, netCode, recipientId, t,
}) => (
  <AccountInfo
    token={activeToken}
    netCode={netCode}
    address={recipientId}
    addressClass="receiver-address"
    label={t('Recipient')}
  />
);

export const TransactionId = ({ id, t }) => (
  <ValueAndLabel label={t('Transaction ID')}>
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
  </ValueAndLabel>
);

export const Message = ({
  activeToken, transaction, t,
}) => {
  if (transaction.type !== transactionTypes().transfer.code.legacy
    || activeToken !== tokenMap.LSK.key) return null;
  return (
    <ValueAndLabel label={t('Message')}>
      <div className="tx-reference">
        {getTxAsset(transaction)}
      </div>
    </ValueAndLabel>
  );
};

export const Amount = ({
  t, transaction, addresses, activeToken,
}) => (
  <ValueAndLabel label={t('Amount of Transaction')}>
    <DiscreetMode addresses={addresses} shouldEvaluateForOtherAccounts>
      <span className="tx-amount">
        <LiskAmount val={getTxAmount(transaction)} />
        {' '}
        {activeToken}
      </span>
    </DiscreetMode>
  </ValueAndLabel>
);

export const Date = ({ t, timestamp, activeToken }) => (
  <ValueAndLabel label={t('Date')}>
    <span className={`${styles.date} tx-date`}>
      <DateTimeFromTimestamp
        fulltime
        className="date"
        time={timestamp}
        token={activeToken}
        showSeconds
      />
    </span>
  </ValueAndLabel>
);

export const Fee = ({ t, fee, activeToken }) => (
  <ValueAndLabel label={t('Transaction fee')}>
    <span className="tx-fee">
      <LiskAmount val={fee} />
      {' '}
      {activeToken}
    </span>
  </ValueAndLabel>
);

export const Confirmations = ({ t, confirmations }) => (
  <ValueAndLabel label={(
    <>
      {t('Confirmations')}
      <Tooltip position="top">
        <p>
          { t('Confirmations refer to the number of blocks added to the {{token}} blockchain after a transaction has been submitted. The more confirmations registered, the more secure the transaction becomes.', { token: tokenMap[activeToken].label })}
        </p>
      </Tooltip>
    </>
    )}
  >
    <span className="tx-confirmation">
      {confirmations}
    </span>
  </ValueAndLabel>
);
