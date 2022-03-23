import React from 'react';
import { MODULE_ASSETS_MAP } from '@common/configuration';
import Icon from '@basics/icon';
import { truncateAddress } from '@common/utilities/account';
import LiskAmount from '@shared/liskAmount';
import styles from './transactionsAndBlocks.css';

const getTxConfig = (t, transactions) => {
  const { asset, fee } = transactions[0];

  return {
    icon: transactions[0].moduleAssetId === '2:0' ? undefined : MODULE_ASSETS_MAP['2:0'].icon,
    subTitle: transactions[0].moduleAssetId === '2:0' ? t('Amount') : t('Fee'),
    value: transactions[0].moduleAssetId === '2:0' ? asset.amount : fee,
  };
};

const Transactions = ({
  t, transactions, onSelectedRow, rowItemIndex, updateRowItemIndex, activeToken,
}) => {
  const txConfig = getTxConfig(t, transactions);

  return (
    <div className={`${styles.wrapper} transactions`}>
      <header className={`${styles.header} transactions-header`}>
        <div className={`${styles.subTitles} transactions-subtitle`}>
          <label>{t('Transaction')}</label>
          <label>{txConfig.subTitle}</label>
        </div>
      </header>
      <div className={`${styles.content} transactions-content`}>
        <div
          data-index={0}
          className={`${styles.resultRow} ${rowItemIndex === 0 ? styles.active : ''} search-transaction-row`}
          onClick={() => onSelectedRow(transactions[0].id)}
          onMouseEnter={updateRowItemIndex}
        >
          {txConfig.icon ? <Icon name={txConfig.icon} /> : null }
          <span className={`${styles.transactionId} transaction-id`}>{truncateAddress(transactions[0].id)}</span>
          <span className={styles.transactionMessage}>
            <LiskAmount val={txConfig.value} token={activeToken} />
          </span>
        </div>
      </div>
    </div>
  );
};

export default Transactions;
