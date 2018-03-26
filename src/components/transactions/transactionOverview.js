import React from 'react';
import Waypoint from 'react-waypoint';
import CopyToClipboard from '../copyToClipboard';
import EmptyState from '../emptyState';
import TransactionList from './transactionList';
import LiskAmount from '../liskAmount';
import styles from './transactions.css';
import txFilters from './../../constants/transactionFilters';

class Transactions extends React.Component {
  constructor(props) {
    super(props);
    this.canLoadMore = true;
  }

  loadMore() {
    if (this.canLoadMore) {
      this.canLoadMore = false;
      this.props.transactionsRequested({
        activePeer: this.props.activePeer,
        address: this.props.address,
        limit: 25,
        offset: this.props.transactions.length,
        filter: this.props.activeFilter,
      });
    }
  }

  // eslint-disable-next-line class-methods-use-this
  isSmallScreen() {
    return window.innerWidth <= 768;
  }

  componentDidUpdate() {
    const { count, transactions } = this.props;
    this.canLoadMore = count === null || count > transactions.length;
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

    return (
      <div className={`transactions ${styles.activity}`}>
        <header>
          <h2 className={styles.title}>{this.props.t('Activity')}</h2>
          <div className={styles.account}>
            <h2>
              {!this.isLoading()
                ? <span>
                  <LiskAmount val={this.props.balance}/>&nbsp;
                </span>
                : null
              }
              <small className={styles.balanceUnit}>LSK</small>
            </h2>
            <CopyToClipboard value={this.props.address} className={`${styles.address}`} copyClassName={styles.copy}/>
          </div>

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
                onClick={() => { this.props.transactionsFilterSet({ filter: filter.value }); }}>
                {filter.name}
              </li>
            ))}
          </ul>
        }
        <TransactionList
          filter={filters[this.props.activeFilter]}
          address={this.props.address}
          transactions={this.props.transactions}
          loadMore={this.loadMore.bind(this)}
          nextStep={this.props.nextStep}
          onClick={this.props.nextStep}
          loading={this.isLoading()}
          t={this.props.t}
          history={this.props.history}
        />
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

export default Transactions;
