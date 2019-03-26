import React from 'react';
import svg from '../../utils/svgIcons';
import styles from './transactions.css';

const Transactions = (props) => {
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
        <label>{props.t('Transactions')}</label>
        <div className={`${styles.subTitles} transactions-subtitle`}>
          <label>{props.t('Type')}</label>
          <label>{props.t('Message')}</label>
        </div>
      </header>
      <div className={`${styles.content} transactions-content`}>
      {
        props.transactions.map(transaction => (
          <div
            key={transaction.id}
            className={`${styles.transactionRow} transactions-row`}
            onClick={() => props.onSelectedRow(transaction.id, 'transaction')}
          >
            <img src={selectTransactionType(transaction.type)} />
            <span className={styles.transactionId}>{transaction.id}</span>
            <span className={styles.transactionMessage}>{Object.entries(transaction.asset).length ? transaction.asset.data : ''}</span>
          </div>
        ))
      }
      </div>
    </div>
  );
};

export default Transactions;
