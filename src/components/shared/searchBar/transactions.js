import React from 'react';
import LiskAmount from '../liskAmount';
import styles from './transactionsAndBlocks.css';
import transactionTypes from '../../../constants/transactionTypes';
import Icon from '../../toolbox/icon';

const Transactions = ({
  t, transactions, onSelectedRow, rowItemIndex, updateRowItemIndex,
}) => {
  function selectTransactionType() {
    return {
      [transactionTypes().send.code]: {
        subTitle: t('Amount'),
        value: transactions[0].amount,
      },
      [transactionTypes().setSecondPassphrase.code]: {
        icon: 'tx2ndPassphrase',
        subTitle: t('Fee'),
        value: transactions[0].fee,
      },
      [transactionTypes().registerDelegate.code]: {
        icon: 'txDelegate',
        subTitle: t('Fee'),
        value: transactions[0].fee,
      },
      [transactionTypes().vote.code]: {
        icon: 'txVote',
        subTitle: t('Fee'),
        value: transactions[0].fee,
      },
    }[transactions[0].type] || {
      icon: 'txDefault',
      subTitle: t('Amount'),
      value: transactions[0].amount,
    };
  }

  const transactionType = selectTransactionType();

  return (
    <div className={`${styles.wrapper} transactions`}>
      <header className={`${styles.header} transactions-header`}>
        <div className={`${styles.subTitles} transactions-subtitle`}>
          <label>{t('Transaction')}</label>
          <label>{transactionType.subTitle}</label>
        </div>
      </header>
      <div className={`${styles.content} transactions-content`}>
        {
          transactions.map((transaction, index) => (
            <div
              key={transaction.id}
              data-index={index}
              className={`${styles.resultRow} ${rowItemIndex === index ? styles.active : ''} search-transaction-row`}
              onClick={() => onSelectedRow(transaction.id)}
              onMouseEnter={updateRowItemIndex}
            >
              {transactionType.icon ? <Icon name={transactionType.icon} /> : null }
              <span className={`${styles.transactionId} transaction-id`}>{transaction.id}</span>
              <span className={styles.transactionMessage}>
                <LiskAmount val={transactionType.value} />
                <span>{t(' LSK')}</span>
              </span>
            </div>
          ))
        }
      </div>
    </div>
  );
};

export default Transactions;
