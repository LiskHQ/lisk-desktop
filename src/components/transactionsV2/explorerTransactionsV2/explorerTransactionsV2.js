import React from 'react';
import TransactionsOverviewV2 from '../transactionsOverviewV2';
import txFilters from '../../../constants/transactionFilters';
import TransactionsOverviewHeader from '../transactionsOverviewHeader/transactionsOverviewHeader';
import routes from '../../../constants/routes';

class ExplorerTransactions extends React.Component {
  constructor() {
    super();

    this.onInit = this.onInit.bind(this);
    this.onLoadMore = this.onLoadMore.bind(this);
    this.onFilterSet = this.onFilterSet.bind(this);
    this.onTransactionRowClick = this.onTransactionRowClick.bind(this);
    // this.searchMoreVoters = this.searchMoreVoters.bind(this);
  }

  onInit() {
    this.props.searchAccount({
      address: this.props.address,
    });

    this.props.searchTransactions({
      address: this.props.address,
      limit: 30,
      filter: txFilters.all,
    });

    this.props.addFilter({
      filterName: 'transactions',
      value: txFilters.all,
    });
  }

  // searchMoreVoters(offset) {
  //   this.props.searchMoreVoters({
  //     address: this.props.address,
  //     offset,
  //   });
  // }

  onLoadMore() {
    this.props.searchMoreTransactions({
      address: this.props.address,
      limit: 30,
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
    this.props.searchTransactions({
      address: this.props.address,
      limit: 30,
      filter,
    });
  }

  onTransactionRowClick(props) {
    const transactionPath = `${routes.transactions.pathPrefix}${routes.transactions.path}/${props.value.id}`;
    this.props.history.push(transactionPath);
  }

  render() {
    const overviewProps = {
      ...this.props,
      canLoadMore: this.props.transactions.length < this.props.count,
      onInit: this.onInit,
      onLoadMore: this.onLoadMore,
      onFilterSet: this.onFilterSet,
      onTransactionRowClick: this.onTransactionRowClick,
      // searchMoreVoters: this.searchMoreVoters,
    };

    return (
      <React.Fragment>
        <TransactionsOverviewHeader
          delegate={this.props.delegate}
          followedAccounts={this.props.followedAccounts}
          address={this.props.address}
          match={this.props.match}
          t={this.props.t}
          account={this.props.account}
        />
        <TransactionsOverviewV2 {...overviewProps} />
      </React.Fragment>
    );
  }
}

export default ExplorerTransactions;
