import React, { Component } from 'react';
import styles from './recentTransactions.css';

class TransactionList extends Component {
  render() {
    const { t, transactions } = this.props;

    return (
      <div className={`${styles.wrapper} recent-transactions-list-container`}>
        <header>
          <label>{t('Transactions')}</label>
          <label>{t('Amount')}</label>
        </header>
        <div >
        {
          transactions.map(tx =>
            <div key={tx.id} className={styles.listRow}>
              {tx.recipientId} - {tx.amount}
            </div>)
        }
        </div>
      </div>
    );
  }
}

export default TransactionList;
