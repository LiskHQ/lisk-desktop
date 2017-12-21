import React from 'react';
import MultiStep from './../multiStep';
import styles from './transactions.css';
import Box from '../box';
import TransactionOverview from './transactionOverview';
import TransactionDetailView from './transactionDetailView';

class Transactions extends React.Component {
  constructor() {
    super();
    this.canLoadMore = true;
  }

  loadMore() {
    if (this.canLoadMore) {
      this.canLoadMore = false;
      this.props.transactionsRequested({
        activePeer: this.props.activePeer,
        address: this.props.address,
        limit: 20,
        offset: this.props.transactions.length,
      });
    }
  }

  componentDidUpdate() {
    const { count, transactions } = this.props;
    this.canLoadMore = count === null || count > transactions.length;
  }

  render() {
    return (
      <Box className={`transactions ${styles.transactions} `}>
        <MultiStep>
          <TransactionOverview {...this.props} />
          <TransactionDetailView />
        </MultiStep>
      </Box>
    );
  }
}

export default Transactions;
