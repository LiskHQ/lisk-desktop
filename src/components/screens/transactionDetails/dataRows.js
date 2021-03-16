import React from 'react';
import { tokenMap, MODULE_ASSETS } from '@constants';
import { getTxAmount } from '@utils/api/transaction';
import CopyToClipboard from '../../toolbox/copyToClipboard';
import TransactionTypeFigure from '../../shared/transactionTypeFigure';
import AccountInfo from './accountInfo';
import { DateTimeFromTimestamp } from '../../toolbox/timestamp';
import Tooltip from '../../toolbox/tooltip/tooltip';
import DiscreetMode from '../../shared/discreetMode';
import LiskAmount from '../../shared/liskAmount';
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
  const TypeInfo = MODULE_ASSETS.getByCode(transaction.title);
  if (transaction.title === MODULE_ASSETS().transfer.key) return null;
  return (
    <BoxRow className={styles.summaryHeader}>
      <TransactionTypeFigure
        address={transaction.senderId}
        transactionType={transaction.title}
      />
      <h2 className="tx-header">{TypeInfo.title}</h2>
    </BoxRow>
  );
};

export const Sender = ({
  transaction, activeToken, network,
}) => {
  const { senderLabel } = MODULE_ASSETS.getByCode(transaction.type || 0);

  return (
    <BoxRow className={styles.detailsWrapper}>
      <AccountInfo
        name={getDelegateName(transaction, activeToken)}
        token={activeToken}
        network={network}
        address={transaction.senderId}
        addressClass="sender-address"
        label={senderLabel}
      />
    </BoxRow>
  );
};

export const Recipient = ({
  activeToken, network, transaction, t,
}) => {
  if (transaction.type !== MODULE_ASSETS().transfer.code.legacy) return null;
  return (
    <BoxRow className={styles.detailsWrapper}>
      <AccountInfo
        token={activeToken}
        network={network}
        address={transaction.recipientId}
        addressClass="receiver-address"
        label={t('Recipient')}
      />
    </BoxRow>
  );
};

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
}) => {
  if (
    transaction.amount === undefined
    && transaction.asset.amount === undefined
    && transaction.type !== MODULE_ASSETS().unlockToken.code.new
  ) {
    return null;
  }

  return (
    <BoxRow>
      { transaction.title === 'transfer' || transaction.title === 'unlockToken'
        ? (
          <div className={styles.value}>
            <span className={styles.label}>
              {t('Amount of Transaction')}
            </span>
            <DiscreetMode addresses={addresses} shouldEvaluateForOtherAccounts>
              <span className="tx-amount">
                <LiskAmount val={getTxAmount(transaction)} token={activeToken} />
              </span>
            </DiscreetMode>
          </div>
        )
        : null
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
};

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
  if (transaction.title !== 'transfer'
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

export const DelegateUsername = ({
  transaction, t,
}) => {
  if (transaction.title !== 'registerDelegate') return null;

  return (
    <BoxRow className={styles.message}>
      <div className={`${styles.value}`}>
        <span className={styles.label}>{t('Delegate username')}</span>
        <div className="delegate-username">
          { transaction.asset.delegate.username }
        </div>
      </div>
    </BoxRow>
  );
};
