import React from 'react';
import MultiStep from './../../multiStep';
import styles from './../transactions.css';
import TransactionOverview from './../transactionOverview';
import TransactionDetailView from './../transactionDetailView';
import Box from './../../box';

class ExplorerTransactions extends React.Component {
  onInit() {
    this.props.searchAccount({
      activePeer: this.props.activePeer,
      address: this.props.address,
    });
    this.props.searchTransactions({
      activePeer: this.props.activePeer,
      address: this.props.address,
      limit: 25,
      filter: this.props.activeFilter,
    });
  }
  onLoadMore() {
    this.props.searchMoreTransactions({
      activePeer: this.props.activePeer,
      address: this.props.address,
      limit: 25,
      offset: this.props.offset,
      filter: this.props.activeFilter,
    });
  }
  onFilterSet(filter) {
    this.props.searchTransactions({
      activePeer: this.props.activePeer,
      address: this.props.address,
      limit: 25,
      filter,
      showLoading: false,
    });
  }

  render() {
    const overviewProps = {
      ...this.props,
      onInit: this.onInit.bind(this),
      onLoadMore: this.onLoadMore.bind(this),
      onFilterSet: this.onFilterSet.bind(this),
    };

    return (
      <Box>
        <MultiStep className={styles.transactions}>
          <TransactionOverview {...overviewProps} />
          <TransactionDetailView {...this.props} />
        </MultiStep>
      </Box>
    );
  }
}

export default ExplorerTransactions;
