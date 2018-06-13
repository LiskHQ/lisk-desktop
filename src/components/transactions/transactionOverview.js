import React from 'react';
import { connect } from 'react-redux';
import Waypoint from 'react-waypoint';
import EmptyState from '../emptyState';
import TransactionList from './transactionList';
import styles from './transactions.css';
import txFilters from './../../constants/transactionFilters';
import routes from './../../constants/routes';

class TransactionsOverview extends React.Component {
  constructor(props) {
    super(props);
    this.canLoadMore = true;

    this.props.onInit();
  }

  loadMore() {
    if (this.canLoadMore) {
      this.canLoadMore = false;
      this.props.onLoadMore();
    }
  }

  // eslint-disable-next-line class-methods-use-this
  isSmallScreen() {
    return window.innerWidth <= 768;
  }

  componentDidUpdate() {
    this.canLoadMore = this.props.count === null ||
      this.props.count > this.props.transactions.length;
  }

  isActiveFilter(filter) {
    return (!this.props.activeFilter && filter === txFilters.all) ||
      (this.props.activeFilter === filter);
  }

  shouldShowEmptyState() {
    return this.props.transactions.length === 0 && !this.isLoading() &&
      (!this.props.activeFilter || this.props.activeFilter === txFilters.all);
  }

  isLoading() {
    return this.props.loading.length > 0;
  }

  setTransactionsFilter(filter) {
    this.props.onFilterSet(filter);
  }

  render() {
    const isWalletPage = this.props.location.pathname === routes.wallet.path;
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

    if (!isWalletPage) {
      if (this.props.delegate && Object.values(this.props.delegate).length > 0) {
        filters[txFilters.statistics] = {
          name: this.isSmallScreen() ? this.props.t('Stats') : this.props.t('Delegate statistics'),
          value: txFilters.statistics,
          className: 'delegate-statistics',
        };
      } else {
        filters[txFilters.accountInfo] = {
          name: this.isSmallScreen() ? this.props.t('Info') : this.props.t('Account Info'),
          value: txFilters.accountInfo,
          className: 'account-info',
        };
      }
    }

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
            filter={filters[this.props.activeFilter]}
            delegate={this.props.delegate}
            votes={this.props.votes}
            voters={this.props.voters}
            address={this.props.address}
            publicKey={this.props.publicKey}
            transactions={this.props.transactions}
            loadMore={this.loadMore.bind(this)}
            nextStep={this.props.nextStep}
            loading={this.isLoading()}
            t={this.props.t}
            history={this.props.history}
            onClick={props => this.props.onTransactionRowClick(props)}
          />
        }
        {
          // the whole transactions box should be scrollable on XS
          // otherwise only the transaction list should be scrollable
          // (see transactionList.js)
          this.isSmallScreen()
            ? <Waypoint bottomOffset='-80%' key={this.props.transactions.length}
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
});
export default connect(mapStateToProps)(TransactionsOverview);

