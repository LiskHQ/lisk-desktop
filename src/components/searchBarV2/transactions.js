import React from 'react';
import svg from '../../utils/svgIcons';
import styles from './transactions.css';

const Transactions = (props) => {
  function selectTransactionType(value) {
    let transactionIconType = '';

    switch (value) {
      case 0:
        transactionIconType = svg.transaction_send_icon;
        break;

      case 1:
        transactionIconType = svg.transaction_delegate_vote;
        break;

      default:
        break;
    }

    return transactionIconType;
  }

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <label>{props.t('Transactions')}</label>
        <div className={styles.subTitles}>
          <label>{props.t('Type')}</label>
          <label>{props.t('Message')}</label>
        </div>
      </header>
      <div className={styles.content}>
      {
        props.transactions.map(transaction => (
          <div key={transaction.id} className={styles.transactionRow}>
            <img src={selectTransactionType(transaction.type)} />
            <label className={styles.transactionId}>{transaction.id}</label>
            <span className={styles.transactionMessage}>{Object.entries(transaction.asset).length ? transaction.asset.data : ''}</span>
          </div>
        ))
      }
      </div>
    </div>
  );
};

export default Transactions;
