import React from 'react';
import CopyToClipboard from '../../toolbox/copyToClipboard';
import TransactionTypeFigure from '../../shared/transactionTypeFigure';
import { tokenMap } from '../../../constants/tokens';
import AccountInfo from './accountInfo';
import { sizeOfString } from '../../../utils/helpers';
import { DateTimeFromTimestamp } from '../../toolbox/timestamp';
import Tooltip from '../../toolbox/tooltip/tooltip';
import DiscreetMode from '../../shared/discreetMode';
import LiskAmount from '../../shared/liskAmount';
import transactionTypes from '../../../constants/transactionTypes';
import BoxRow from '../../toolbox/box/row';
import styles from './transactionDetails.css';

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
  if (transaction.type === transactionTypes().send.code) return null;
  return (
    <div className={styles.summaryHeader}>
      <TransactionTypeFigure
        address={transaction.senderId}
        transactionType={transaction.type}
      />
      <h2 className="tx-header">{title}</h2>
    </div>
  );
};

export const Sender = ({
  transaction, activeToken, netCode,
}) => {
  const { senderLabel } = transactionTypes.getByCode(transaction.type || 0);

  return (
    <BoxRow className={styles.detailsWrapper}>
      <AccountInfo
        name={getDelegateName(transaction, activeToken)}
        token={activeToken}
        netCode={netCode}
        address={transaction.senderId}
        addressClass="sender-address"
        label={senderLabel}
      />
    </BoxRow>
  );
};

export const Recipient = ({
  activeToken, netCode, transaction, t,
}) => {
  if (transaction.type !== transactionTypes().send.code) return null;
  return (
    <BoxRow className={styles.detailsWrapper}>
      <AccountInfo
        token={activeToken}
        netCode={netCode}
        address={transaction.recipientId}
        addressClass="receiver-address"
        label={t('Recipient')}
      />
    </BoxRow>
  );
};

export const FeeAndAmount = ({
  transaction, activeToken, addresses, t,
}) => (
  <BoxRow>
    { transaction.type === transactionTypes().send.code
      ? (
        <div className={styles.value}>
          <span className={styles.label}>
            {t('Amount')}
          </span>
          <DiscreetMode addresses={addresses} shouldEvaluateForOtherAccounts>
            <span className="tx-amount">
              <LiskAmount val={transaction.amount} />
              {' '}
              {activeToken}
            </span>
          </DiscreetMode>
        </div>
      ) : null }
    <div className={styles.value}>
      <span className={styles.label}>
        {t('Transaction fee')}
      </span>
      <span className="tx-fee">
        <LiskAmount val={transaction.fee} />
        {' '}
        {activeToken}
      </span>
    </div>
  </BoxRow>
);

export const TransactionId = ({ id, t }) => (
  <BoxRow>
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
  </BoxRow>
);

export const DateAndConfirmation = ({
  transaction, activeToken, t,
}) => (
  <BoxRow>
    <div className={styles.value}>
      <span className={styles.label}>{t('Date')}</span>
      <span className={`${styles.date} tx-date`}>
        <DateTimeFromTimestamp
          fulltime
          className="date"
          time={transaction.timestamp}
          token={activeToken}
          showSeconds
        />
      </span>
    </div>
    <div className={`${styles.value}`}>
      <span className={styles.label}>
        {t('Confirmations')}
        <Tooltip className="showOnTop">
          <p>
            { t('Confirmations refer to the number of blocks added to the {{token}} blockchain after a transaction has been submitted. The more confirmations registered, the more secure the transaction becomes.', { token: tokenMap[activeToken].label })}
          </p>
        </Tooltip>
      </span>
      <span className="tx-confirmation">
        {transaction.confirmations || 0}
      </span>
    </div>
  </BoxRow>
);

export const Message = ({
  activeToken, transaction, t,
}) => {
  if (transaction.type !== transactionTypes().send.code || activeToken !== 'LSK') return null;
  return (
    <BoxRow className={styles.message}>
      <div className={`${styles.detailsWrapper}`}>
        <span className={styles.label}>{t('Message')}</span>
        <div className={`${styles.value} tx-reference`}>
          {getTxAsset(transaction)}
        </div>
      </div>
      <div className={`${styles.detailsWrapper}`}>
        <span className={styles.label}>{t('Size')}</span>
        <div className={`${styles.value} tx-size`}>
          {`${sizeOfString(transaction.asset.data)} bytes`}
        </div>
      </div>
    </BoxRow>
  );
};
