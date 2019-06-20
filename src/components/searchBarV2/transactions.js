import React from 'react';
import svg from '../../utils/svgIcons';
import LiskAmount from '../liskAmount';
import styles from './transactions.css';

const Transactions = ({
  t, transactions, onSelectedRow, rowItemIndex, updateRowItemIndex,
}) => {
  function selectTransactionType() {
    const type = transactions[0].type;
    let transaction = {
      icon: svg.txDefault,
      subTitle: t('Amount'),
      value: transactions[0].amount,
    };

    switch (type) {
      case 1:
        transaction = {
          icon: svg.tx2ndPassphrase,
          subTitle: t('Fee'),
          value: transactions[0].fee,
        };
        break;
      case 2:
        transaction = {
          icon: svg.txDelegate,
          subTitle: t('Fee'),
          value: transactions[0].fee,
        };
        break;
      case 3:
        transaction = {
          icon: svg.txVote,
          subTitle: t('Fee'),
          value: transactions[0].fee,
        };
        break;
      default:
        break;
    }

    return transaction;
  }

  const transactionType = selectTransactionType();

  return (
    <div className={`${styles.wrapper} transactions`}>
      <header className={`${styles.header} transactions-header`}>
        <label>{t('Transactions')}</label>
        <div className={`${styles.subTitles} transactions-subtitle`}>
          <label>{t('Type')}</label>
          <label>{transactionType.subTitle}</label>
        </div>
      </header>
      <div className={`${styles.content} transactions-content`}>
      {
        transactions.map((transaction, index) => (
          <div
            key={transaction.id}
            data-index={index}
            className={`${styles.transactionRow} ${rowItemIndex === index ? styles.active : ''} search-transaction-row`}
            onClick={() => onSelectedRow(transaction.id)}
            onMouseEnter={updateRowItemIndex}
          >
            <img src={transactionType.icon} />
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
