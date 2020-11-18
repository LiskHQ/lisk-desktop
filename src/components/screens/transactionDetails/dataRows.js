import React from 'react';
import CopyToClipboard from '../../toolbox/copyToClipboard';
import TransactionTypeFigure from '../../shared/transactionTypeFigure';
import { tokenMap } from '../../../constants/tokens';
import AccountInfo from './accountInfo';
import { DateTimeFromTimestamp } from '../../toolbox/timestamp';
import Tooltip from '../../toolbox/tooltip/tooltip';
import DiscreetMode from '../../shared/discreetMode';
import LiskAmount from '../../shared/liskAmount';
import transactionTypes from '../../../constants/transactionTypes';
import BoxRow from '../../toolbox/box/row';
import styles from './transactionDetails.css';
import { getTxAmount } from '../../../utils/transactions';

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
    <BoxRow className={styles.summaryHeader}>
      <TransactionTypeFigure
        address={transaction.senderId}
        transactionType={transaction.type}
      />
      <h2 className="tx-header">{title}</h2>
    </BoxRow>
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
  if (transaction.type !== transactionTypes().transfer.code.legacy) return null;
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
    { transaction.type === transactionTypes().transfer.code.legacy
      ? (
        <div className={styles.value}>
          <span className={styles.label}>
            {t('Amount')}
          </span>
          <DiscreetMode addresses={addresses} shouldEvaluateForOtherAccounts>
            <span className="tx-amount">
              <LiskAmount val={transaction.amount} token={activeToken} />
            </span>
          </DiscreetMode>
        </div>
      ) : null }
    <div className={styles.value}>
      <span className={styles.label}>
        {t('Transaction fee')}
      </span>
      <span className="tx-fee">
        <LiskAmount val={transaction.fee} token={activeToken} />
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

export const AmountAndDate = ({
  transaction, activeToken, t, addresses,
}) => (
  <BoxRow>
    {
      (transaction.amount !== undefined || transaction.asset.amount !== undefined) && (
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
      )
    }
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
  </BoxRow>
);

export const FeeAndConfirmation = ({
  transaction, activeToken, t,
}) => (
  <BoxRow>
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
    <div className={`${styles.value}`}>
      <span className={styles.label}>
        {t('Confirmations')}
        <Tooltip position="top">
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
        <Tooltip position="top">
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
  if (transaction.type !== transactionTypes().transfer.code.legacy
    || activeToken !== tokenMap.LSK.key) return null;
  return (
    <BoxRow className={styles.message}>
      <div className={`${styles.value}`}>
        <span className={styles.label}>{t('Message')}</span>
        <div className="tx-reference">
          {getTxAsset(transaction)}
        </div>
      </div>
    </BoxRow>
  );
};
