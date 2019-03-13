import React from 'react';
import styles from './../transactions.css';
import TransactionsOverview from '../transactionsOverview';
import Box from './../../box';
import txFilters from './../../../constants/transactionFilters';
import routes from './../../../constants/routes';

class ExplorerTransactions extends React.Component {
  onInit() {
    this.props.searchAccount({
      address: this.props.address,
    });
    this.props.searchTransactions({
      address: this.props.address,
      limit: 25,
      filter: txFilters.all,
    });

    this.props.addFilter({
      filterName: 'transactions',
      value: txFilters.all,
    });
  }

  searchMoreVoters(offset) {
    this.props.searchMoreVoters({
      address: this.props.address,
      offset,
    });
  }

  onLoadMore() {
    this.props.searchMoreTransactions({
      address: this.props.address,
      limit: 25,
      offset: this.props.offset,
      filter: this.props.activeFilter,
    });
  }
  /*
    Transactions from tabs are filtered based on filter number
    It applys to All, Incoming and Outgoing
    for other tabs that are not using transactions there is no need to call API
  */
  onFilterSet(filter) {
    if (filter <= 2) {
      this.props.searchTransactions({
        address: this.props.address,
        limit: 25,
        filter,
        showLoading: false,
      });
    } else {
      this.props.addFilter({
        filterName: 'transactions',
        value: filter,
      });
    }
  }

  onTransactionRowClick(props) {
    const explorerBasePath = `${routes.transactions.pathPrefix}${routes.transactions.path}`;
    const transactionDetailPath = `${explorerBasePath}/${props.value.id}`;
    this.props.history.push(transactionDetailPath);
  }

  render() {
    const overviewProps = {
      ...this.props,
      onInit: this.onInit.bind(this),
      onLoadMore: this.onLoadMore.bind(this),
      onFilterSet: this.onFilterSet.bind(this),
      onTransactionRowClick: this.onTransactionRowClick.bind(this),
      searchMoreVoters: this.searchMoreVoters.bind(this),
    };

    return (
      <Box className={`${styles.wrapper} ${styles.transactions}`}>
        <TransactionsOverview {...overviewProps} />
      </Box>
    );
  }
}

export default ExplorerTransactions;
