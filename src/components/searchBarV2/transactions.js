import React from 'react';
import svg from '../../utils/svgIcons';
import LiskAmount from '../liskAmount';
import styles from './transactions.css';

const Transactions = ({ t, transactions, onSelectedRow }) => {
  function selectTransactionType(type) {
    let icon = svg.txDefault;
    switch (type) {
      case 1:
        icon = svg.tx2ndPassphrase;
        break;
      case 2:
        icon = svg.txDelegate;
        break;
      case 3:
        icon = svg.txVote;
        break;
      default:
        break;
    }

    return icon;
  }

  return (
    <div className={`${styles.wrapper} transactions`}>
      <header className={`${styles.header} transactions-header`}>
        <label>{t('Transactions')}</label>
        <div className={`${styles.subTitles} transactions-subtitle`}>
          <label>{t('Type')}</label>
          <label>{t('Message')}</label>
        </div>
      </header>
      <div className={`${styles.content} transactions-content`}>
      {
        transactions.map(transaction => (
          <div
            key={transaction.id}
            className={`${styles.transactionRow} transaction-row`}
            onClick={() => onSelectedRow(transaction.id, 'transaction')}
          >
            <img src={selectTransactionType(transaction.type)} />
            <span className={`${styles.transactionId} transaction-id`}>{transaction.id}</span>
            <span className={styles.transactionMessage}>
              <LiskAmount val={transaction.amount} />
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
