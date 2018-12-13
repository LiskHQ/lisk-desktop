import React from 'react';
import MultiStep from '../multiStep';
import styles from './transactions.css';
import TransactionsOverview from './transactionsOverview';
import TransactionDetailView from './transactionDetailView';
import Box from '../box';

class Transactions extends React.Component {
  render() {
    return (
      <Box>
        <MultiStep className={styles.transactions}>
          <TransactionsOverview {...this.props} />
          <TransactionDetailView {...this.props} />
        </MultiStep>
      </Box>
    );
  }
}

export default Transactions;
