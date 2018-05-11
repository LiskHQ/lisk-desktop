import React from 'react';
import { connect } from 'react-redux';
import Waypoint from 'react-waypoint';
import EmptyState from '../emptyState';
import TransactionList from './transactionList';
import styles from './transactions.css';
import txFilters from './../../constants/transactionFilters';

class Transactions extends React.Component {
  constructor(props) {
    super(props);
    this.canLoadMore = true;

    this.state = {
      transactions: [],
      account: {},
      activeFilter: 0,
      count: null,
    };

    if (this.props.address !== this.props.account.address) {
      if (!this.props.search.transactions[this.props.address]) {
        this.props.searchAccount({
          activePeer: this.props.peers.data,
          address: this.props.address,
        });
        this.props.searchTransactions({
          activePeer: this.props.peers.data,
          address: this.props.address,
          limit: 25,
          filter: this.props.filter,
        });
      } else {
        this.props.searchUpdateLast({
          address: this.props.address,
        });
      }
    } else {
      this.props.loadTransactions({
        activePeer: this.props.peers.data,
        address: this.props.address,
        publicKey: this.props.account.publicKey,
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.address === this.props.account.address) {
      this.setState({
        transactions: nextProps.transactions.confirmed,
        count: nextProps.transactions.count,
        account: nextProps.account,
        activeFilter: nextProps.transactions.filter,
      });
    } else if (nextProps.search.lastSearch) {
      this.setState({
        transactions: nextProps.search.searchResults,
        count: nextProps.search.transactions[nextProps.search.lastSearch].count,
        account: nextProps.search.accounts[nextProps.search.lastSearch],
        activeFilter: nextProps.search.transactions[nextProps.search.lastSearch].filter,
      });
    }
  }

  componentWillUnmount() {
    this.setTransactionsFilter(txFilters.all);
  }

  loadMore() {
    if (this.canLoadMore) {
      this.canLoadMore = false;

      if (this.props.address === this.props.account.address) {
        this.props.transactionsRequested({
          activePeer: this.props.activePeer,
          address: this.props.address,
          limit: 25,
          offset: this.props.transactions.length,
          filter: this.props.activeFilter,
        });
      } else {
        this.props.searchMoreTransactions({
          activePeer: this.props.activePeer,
          address: this.props.address,
          limit: 25,
          offset: this.props.search.transactions[this.props.address].transactions.length,
          filter: this.props.search.transactions[this.props.address].filter,
        });
      }
    }
  }

  // eslint-disable-next-line class-methods-use-this
  isSmallScreen() {
    return window.innerWidth <= 768;
  }

  componentDidUpdate() {
    this.canLoadMore = this.state.count === null ||
      this.state.count > this.state.transactions.length;
  }

  isActiveFilter(filter) {
    return (!this.state.activeFilter && filter === txFilters.all) ||
      (this.state.activeFilter === filter);
  }

  shouldShowEmptyState() {
    return this.state.transactions.length === 0 && !this.isLoading() &&
      (!this.state.activeFilter || this.state.activeFilter === txFilters.all);
  }

  isLoading() {
    return this.props.loading.length > 0;
  }

  setTransactionsFilter(filter) {
    if (this.props.address === this.props.account.address) {
      this.props.transactionsFilterSet({
        activePeer: this.props.activePeer,
        address: this.props.address,
        limit: 25,
        filter,
      });
    } else {
      this.props.searchTransactions({
        activePeer: this.props.activePeer,
        address: this.props.address,
        limit: 25,
        filter,
        showLoading: false,
      });
    }
  }

  render() {
    const filters = [
      {
        name: this.props.t('All'),
        value: txFilters.all,
        className: 'filter-all',
      },
      {
        name: this.isSmallScreen() ? this.props.t('In') : this.props.t('Incoming'),
        value: txFilters.incoming,
        className: 'filter-in',
      },
      {
        name: this.isSmallScreen() ? this.props.t('Out') : this.props.t('Outgoing'),
        value: txFilters.outgoing,
        className: 'filter-out',
      },
    ];

    if (this.props.delegate) {
      filters.push({
        name: this.isSmallScreen() ? this.props.t('Stats') : this.props.t('Delegate statistics'),
        value: txFilters.statistics,
        className: 'delegate-statistics',
      });
    }

    const wayoutIndex = this.state.transactions.length > 15 ?
      this.state.transactions.length - 10 :
      this.state.transactions.length;

    return (
      <div className={`transactions ${styles.activity}`}>
        <header>
          <h2 className={styles.title}>{this.props.t('Activity')}</h2>

        </header>
        {this.shouldShowEmptyState() ?
          <EmptyState title={this.props.t('No activity yet')}
            message={this.props.t('The Wallet will show your recent transactions.')} /> :
          null }
        {this.shouldShowEmptyState() ?
          null :
          <ul className={styles.list}>
            {filters.map((filter, i) => (
              <li key={i} className={`transaction-filter-item ${filter.className} ${styles.item} ${this.isActiveFilter(filter.value) ? styles.active : ''}`}
                onClick={() => this.setTransactionsFilter(filter.value)}>
                {filter.name}
              </li>
            ))}
          </ul>
        }
        {
          <TransactionList
            filter={filters[this.state.activeFilter]}
            address={this.props.address}
            publicKey={this.props.publicKey}
            transactions={this.state.transactions}
            loadMore={this.loadMore.bind(this)}
            nextStep={this.props.nextStep}
            onClick={this.props.nextStep}
            loading={this.isLoading()}
            t={this.props.t}
            history={this.props.history}
          />
        }
        {
          // the whole transactions box should be scrollable on XS
          // otherwise only the transaction list should be scrollable
          // (see transactionList.js)
          this.isSmallScreen()
            ? <Waypoint bottomOffset='-80%' key={wayoutIndex}
              onEnter={() => { this.loadMore(); }}></Waypoint>
            : null
        }
      </div>
    );
  }
}
const mapStateToProps = state => ({
  peers: state.peers,
  account: state.account,
  transactions: state.transactions,
  search: state.search,
});
export default connect(mapStateToProps)(Transactions);

