import React from 'react';
import { tokenMap, MODULE_ASSETS_NAME_ID_MAP } from '@constants';
import { getTxAmount } from '@utils/transaction';
import { getModuleAssetSenderLabel, getModuleAssetTitle } from '@utils/moduleAssets';
import CopyToClipboard from '@toolbox/copyToClipboard';
import TransactionTypeFigure from '@shared/transactionTypeFigure';
import { DateTimeFromTimestamp } from '@toolbox/timestamp';
import Tooltip from '@toolbox/tooltip/tooltip';
import DiscreetMode from '@shared/discreetMode';
import LiskAmount from '@shared/liskAmount';
import BoxRow from '@toolbox/box/row';
import AccountInfo from './accountInfo';
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
  if (transaction.moduleAssetId === MODULE_ASSETS_NAME_ID_MAP.transfer) {
    return null;
  }
  return (
    <BoxRow className={styles.summaryHeader}>
      <TransactionTypeFigure
        address={transaction.sender.address}
        moduleAssetId={transaction.moduleAssetId}
      />
      <h2 className="tx-header">{getModuleAssetTitle()[transaction.moduleAssetId]}</h2>
    </BoxRow>
  );
};

export const Sender = ({
  transaction, activeToken, network,
}) => {
  const senderLabel = getModuleAssetSenderLabel()[transaction.moduleAssetId];

  return (
    <BoxRow className={styles.detailsWrapper}>
      <AccountInfo
        name={getDelegateName(transaction, activeToken)}
        token={activeToken}
        network={network}
        address={transaction.sender.address}
        addressClass="sender-address"
        label={senderLabel}
      />
    </BoxRow>
  );
};

export const Recipient = ({
  activeToken, network, transaction, t,
}) => {
  if (transaction.moduleAssetId !== MODULE_ASSETS_NAME_ID_MAP.transfer) {
    return null;
  }
  return (
    <BoxRow className={styles.detailsWrapper}>
      <AccountInfo
        token={activeToken}
        network={network}
        address={transaction.asset.recipient.address}
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
    && transaction.type !== MODULE_ASSETS_NAME_ID_MAP.unlockToken
  ) {
    return null;
  }

  return (
    <BoxRow>
      {transaction.moduleAssetId === MODULE_ASSETS_NAME_ID_MAP.transfer
        || transaction.moduleAssetId === MODULE_ASSETS_NAME_ID_MAP.unlockToken
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
        : null}
      <div className={styles.value}>
        <span className={styles.label}>{t('Date')}</span>
        <span className={`${styles.date} tx-date`}>
          <DateTimeFromTimestamp
            fulltime
            className="date"
            time={transaction.block.timestamp}
            token={activeToken}
            showSeconds
          />
        </span>
      </div>
    </BoxRow>
  );
};

export const FeeAndConfirmation = ({
  transaction, activeToken, t, currentBlockHeight,
}) => (
  <BoxRow>
    <div className={styles.value}>
      <span className={styles.label}>
        {t('Transaction fee')}
      </span>
      <span className="tx-fee">
        <LiskAmount val={transaction.fee} token={activeToken} />
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
        {
          activeToken === tokenMap.LSK.key
            ? (currentBlockHeight - transaction.height)
            : transaction.confirmations
        }
      </span>
    </div>
  </BoxRow>
);

export const DateAndConfirmation = ({
  transaction, activeToken, t, currentBlockHeight,
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
        {currentBlockHeight ? currentBlockHeight - transaction.height : 0}
      </span>
    </div>
  </BoxRow>
);

export const Message = ({
  activeToken, transaction, t,
}) => {
  if (
    transaction.moduleAssetId !== MODULE_ASSETS_NAME_ID_MAP.transfer
    || activeToken !== tokenMap.LSK.key
  ) {
    return null;
  }

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
  if (transaction.moduleAssetId !== MODULE_ASSETS_NAME_ID_MAP.registerDelegate) {
    return null;
  }

  return (
    <BoxRow className={styles.message}>
      <div className={`${styles.value}`}>
        <span className={styles.label}>{t('Delegate username')}</span>
        <div className="delegate-username">
          { transaction.asset.username }
        </div>
      </div>
    </BoxRow>
  );
};
