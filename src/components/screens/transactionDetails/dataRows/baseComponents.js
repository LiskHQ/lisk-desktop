import React from 'react';

import CopyToClipboard from '../../../toolbox/copyToClipboard';
import TransactionTypeFigure from '../../../shared/transactionTypeFigure';
import { tokenMap } from '../../../../constants/tokens';
import { DateTimeFromTimestamp } from '../../../toolbox/timestamp';
import DiscreetMode from '../../../shared/discreetMode';
import LiskAmount from '../../../shared/liskAmount';

import AccountInfo from './accountInfo';
import styles from './styles.css';
import Tooltip from '../../../toolbox/tooltip/tooltip';

export const ValueAndLabel = ({ label, className, children }) => (
  <div className={`${styles.value} ${className}`}>
    <span className={styles.label}>
      {label}
    </span>
    {children}
  </div>
);

export const Illustration = ({
  type, senderId, title,
}) => (
  <div className={styles.illustration}>
    <TransactionTypeFigure
      address={senderId}
      transactionType={type}
    />
    <h2 className="tx-header">{title}</h2>
  </div>
);

export const Sender = ({
  senderId, delegateName, activeToken, netCode, senderLabel,
}) => (
  <AccountInfo
    className={`${styles.value} ${styles.sender}`}
    name={delegateName}
    token={activeToken}
    netCode={netCode}
    address={senderId}
    addressClass="sender-address"
    label={senderLabel}
  />
);

export const Recipient = ({
  activeToken, netCode, recipientId, t,
}) => (
  <AccountInfo
    className={`${styles.value} ${styles.recipient}`}
    token={activeToken}
    netCode={netCode}
    address={recipientId}
    addressClass="receiver-address"
    label={t('Recipient')}
  />
);

export const TransactionId = ({ t, id }) => (
  <ValueAndLabel label={t('Transaction ID')} className={styles.transactionId}>
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

export const Message = ({ message, t }) => (
  <ValueAndLabel label={t('Message')} className={styles.message}>
    <div className="tx-reference">
      {message}
    </div>
  </ValueAndLabel>
);

export const Amount = ({
  t, amount, addresses, activeToken,
}) => (
  <ValueAndLabel label={t('Amount of Transaction')} className={styles.amount}>
    <DiscreetMode addresses={addresses} shouldEvaluateForOtherAccounts>
      <span className="tx-amount">
        <LiskAmount val={amount} />
        {' '}
        {activeToken}
      </span>
    </DiscreetMode>
  </ValueAndLabel>
);

export const Date = ({ t, timestamp, activeToken }) => (
  <ValueAndLabel label={t('Date')} className={styles.date}>
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
  <ValueAndLabel label={t('Transaction fee')} className={styles.fee}>
    <span className="tx-fee">
      <LiskAmount val={fee} />
      {' '}
      {activeToken}
    </span>
  </ValueAndLabel>
);

export const Confirmations = ({ t, confirmations, activeToken }) => (
  <ValueAndLabel
    className={styles.confirmations}
    label={(
      <>
        {t('Confirmations')}
        <Tooltip position="top">
          <p>
            { t('Confirmations refer to the number of blocks added to the {{token}} blockchain after a transaction has been submitted. The more confirmations registered, the more secure the transaction becomes.',
              { token: tokenMap[activeToken].label })}
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
