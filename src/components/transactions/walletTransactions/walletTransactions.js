import React from 'react';
import MultiStep from './../../multiStep';
import styles from './../transactions.css';
import TransactionOverview from './../transactionOverview';
import TransactionDetailView from './../transactionDetailView';
import Box from './../../box';
import txFilters from './../../../constants/transactionFilters';

class WalletTransactions extends React.Component {
  onInit() {
    this.props.transactionsFilterSet({
      activePeer: this.props.activePeer,
      address: this.props.account.address,
      limit: 25,
      filter: txFilters.all,
    });

    if (this.props.account.isDelegate &&
      this.props.account.delegate &&
      this.props.account.delegate.publicKey) {
      this.props.accountVotersFetched({
        activePeer: this.props.activePeer,
        publicKey: this.props.account.delegate.publicKey,
      });
      this.props.accountVotesFetched({
        activePeer: this.props.activePeer,
        address: this.props.address,
      });
    }
  }
  onLoadMore() {
    this.props.transactionsRequested({
      activePeer: this.props.activePeer,
      address: this.props.address,
      limit: 25,
      offset: this.props.transactions.length,
      filter: this.props.activeFilter,
    });
  }
  onFilterSet(filter) {
    this.props.transactionsFilterSet({
      activePeer: this.props.activePeer,
      address: this.props.address,
      limit: 25,
      filter,
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

export default WalletTransactions;
