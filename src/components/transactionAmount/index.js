import React from 'react';
import transactionTypes from '../../constants/transactionTypes';
import LiskAmount from '../liskAmount';
import styles from './transactionAmount.css';

const TransactionAmount = ({ address, transaction, token }) => {
  const getTransactionType = () => {
    if (address === transaction.recipientId) {
      return <span className={styles.recieve}>
        <LiskAmount val={transaction.amount} /> {token}</span>;
    }

    return <span>- <LiskAmount val={transaction.amount} /> {token}</span>;
  };

  return (
    <div className={`${styles.wrapper} transaction-amount`}>
    {
      transaction.type === transactionTypes.send
      ? getTransactionType()
      : null
    }
    </div>
  );
};

export default TransactionAmount;
