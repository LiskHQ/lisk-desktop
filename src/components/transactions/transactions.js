import React from 'react';
import MultiStep from './../multiStep';
import styles from './transactions.css';
import TransactionOverview from './transactionOverview';
import TransactionDetailView from './transactionDetailView';
import Box from '../box';

class Transactions extends React.Component {
  render() {
    return (
      <Box>
        <MultiStep className={styles.transactions}>
          <TransactionOverview {...this.props} />
          <TransactionDetailView {...this.props} />
        </MultiStep>
      </Box>
    );
  }
}

export default Transactions;
