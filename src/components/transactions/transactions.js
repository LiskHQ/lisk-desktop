import React from 'react';
import MultiStep from './../multiStep';
import styles from './transactions.css';
import TransactionOverview from './transactionOverview';
import TransactionDetailView from './transactionDetailView';

class Transactions extends React.Component {
  render() {
    return (
      <MultiStep className={styles.transactions}>
        <TransactionOverview {...this.props} />
        <TransactionDetailView />
      </MultiStep>
    );
  }
}

export default Transactions;
