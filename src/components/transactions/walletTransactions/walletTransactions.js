import React from 'react';
import MultiStep from './../../multiStep';
import styles from './../transactions.css';
import TransactionsOverview from '../transactionsOverview';
import TransactionDetailView from './../transactionDetailView';
import Box from './../../box';
import txFilters from './../../../constants/transactionFilters';

import routes from './../../../constants/routes';

class WalletTransactions extends React.Component {
  onInit() {
    this.props.transactionsFilterSet({
      address: this.props.account.address,
      limit: 25,
      filter: txFilters.all,
    });

    if (this.props.account.isDelegate &&
      this.props.account.delegate &&
      this.props.account.delegate.publicKey) {
      this.props.accountVotersFetched({
        publicKey: this.props.account.delegate.publicKey,
      });
    }

    this.props.searchAccount({
      address: this.props.address,
    });

    this.props.accountVotesFetched({
      address: this.props.address,
    });

    this.props.addFilter({
      filterName: 'wallet',
      value: txFilters.all,
    });
  }
  /* istanbul ignore next */
  onLoadMore() {
    this.props.transactionsRequested({
      address: this.props.address,
      limit: 25,
      offset: this.props.transactions.length,
      filter: this.props.activeFilter,
    });
  }
  /*
    Transactions from tabs are filtered based on filter number
    It applys to All, Incoming and Outgoing
    for other tabs that are not using transactions there is no need to call API
  */
  /* istanbul ignore next */
  onFilterSet(filter) {
    if (filter <= 2) {
      this.props.transactionsFilterSet({
        address: this.props.address,
        limit: 25,
        filter,
      });
    } else {
      this.props.addFilter({
        filterName: 'wallet',
        value: filter,
      });
    }
  }
  onTransactionRowClick(props) {
    this.props.history.push(`${routes.wallet.path}?id=${props.value.id}`);
  }

  render() {
    const overviewProps = {
      ...this.props,
      onInit: this.onInit.bind(this),
      onLoadMore: this.onLoadMore.bind(this),
      onFilterSet: this.onFilterSet.bind(this),
      onTransactionRowClick: this.onTransactionRowClick.bind(this),
    };

    return (
      <Box>
        <MultiStep className={styles.transactions}>
          <TransactionsOverview {...overviewProps} />
          <TransactionDetailView {...this.props} />
        </MultiStep>
      </Box>
    );
  }
}

export default WalletTransactions;
