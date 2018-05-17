import React from 'react';
import MultiStep from './../../multiStep';
import styles from './../transactions.css';
import TransactionOverview from './../transactionOverview';
import TransactionDetailView from './../transactionDetailView';
import Box from './../../box';

class WalletTransactions extends React.Component {
  render() {
    const onInit = () => {
      this.props.loadTransactions({
        activePeer: this.props.activePeer,
        address: this.props.address,
        publicKey: this.props.account.publicKey,
      });

      if (this.props.account.isDelegate &&
        this.props.account.delegate &&
        this.props.account.delegate.publicKey) {
        this.props.accountVotersFetched({
          activePeer: this.props.peers.data,
          publicKey: this.props.account.delegate.publicKey,
        });
        this.props.accountVotesFetched({
          activePeer: this.props.peers.data,
          address: this.props.address,
        });
      }
    };
    const onLoadMore = () => {
      this.props.transactionsRequested({
        activePeer: this.props.activePeer,
        address: this.props.address,
        limit: 25,
        offset: this.props.transactions.length,
        filter: this.props.activeFilter,
      });
    };
    const onFilterSet = (filter) => {
      this.props.transactionsFilterSet({
        activePeer: this.props.activePeer,
        address: this.props.address,
        limit: 25,
        filter,
      });
    };

    const overviewProps = {
      ...this.props,
      onInit,
      onLoadMore,
      onFilterSet,
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
