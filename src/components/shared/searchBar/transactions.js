import React from 'react';
import transactionTypes from 'constants';
import LiskAmount from '../liskAmount';
import styles from './transactionsAndBlocks.css';
import Icon from '../../toolbox/icon';

const getTxConfig = (t, transactions) => {
  const config = transactionTypes()[transactions[0].title];
  const { amount, fee } = transactions[0];

  return {
    icon: transactions[0].title === 'transfer' ? undefined : config.icon,
    subTitle: transactions[0].title === 'transfer' ? t('Amount') : t('Fee'),
    value: transactions[0].title === 'transfer' ? amount : fee,
  };
};

const Transactions = ({
  t, transactions, onSelectedRow, rowItemIndex, updateRowItemIndex,
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
          <span className={`${styles.transactionId} transaction-id`}>{transactions[0].id}</span>
          <span className={styles.transactionMessage}>
            <LiskAmount val={txConfig.value} />
            <span>{t(' LSK')}</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Transactions;
