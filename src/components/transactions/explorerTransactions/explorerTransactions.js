import React from 'react';
import MultiStep from './../../multiStep';
import styles from './../transactions.css';
import TransactionOverview from './../transactionOverview';
import TransactionDetailView from './../transactionDetailView';
import Box from './../../box';
import txFilters from './../../../constants/transactionFilters';
import routes from './../../../constants/routes';

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
      filter: txFilters.all,
    });

    this.props.addFilter({
      filterName: 'transactions',
      value: txFilters.all,
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
  /*
    Transactions from tabs are filtered based on filter number
    It applys to All, Incoming and Outgoing
    for other tabs that are not using transactions there is no need to call API
  */
  onFilterSet(filter) {
    if (filter <= 2) {
      this.props.searchTransactions({
        activePeer: this.props.activePeer,
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
    const explorerBasePath = `${routes.accounts.pathPrefix}${routes.accounts.path}`;
    const accountPath = `${explorerBasePath}/${this.props.address}`;
    const transactionDetailPath = `${accountPath}?id=${props.value.id}`;
    this.props.history.push(transactionDetailPath);
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
          <TransactionOverview {...overviewProps} />
          <TransactionDetailView {...this.props} />
        </MultiStep>
      </Box>
    );
  }
}

export default ExplorerTransactions;
