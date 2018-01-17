import React from 'react';
import Waypoint from 'react-waypoint';
import CopyToClipboard from '../copyToClipboard';
import TransactionList from './transactionList';
import LiskAmount from '../liskAmount';
import Box from '../box';
import styles from './transactions.css';
import { setFilterAndReload, loadTransactions } from './../../utils/transactions';
import txFilters from './../../constants/transactionFilters';

class Transactions extends React.Component {
  constructor(props) {
    super(props);
    this.canLoadMore = true;
  }

  loadMore() {
    if (this.canLoadMore) {
      this.canLoadMore = false;
      loadTransactions({ filter: this.props.activeFilter, offset: this.props.transactions.length });
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
      <Box className={`transactions ${styles.activity}`}>
        <header>
          <h2 className={styles.title}>{this.props.t('Activity')}</h2>
          <div className={styles.account}>
            <h2>
              <span>
                <LiskAmount val={this.props.balance} />&nbsp;
              </span>
              <small className={styles.balanceUnit}>LSK</small>
            </h2>
            <CopyToClipboard value={this.props.address} className={`${styles.address}`} />
          </div>
        </header>

        <ul className={styles.list}>
          {filters.map((filter, i) => (
            <li key={i} className={`transaction-filter-item ${filter.className} ${styles.item} ${this.isActiveFilter(filter.value) ? styles.active : ''}`}
              onClick={setFilterAndReload.bind(this, { filter: filter.value })}>{filter.name}</li>
          ))}
        </ul>
        {
          // temporary solution until we have proper loaders
          !this.props.loading.length
            ? <TransactionList
              address={this.props.address}
              transactions={this.props.transactions}
              loadMore={this.loadMore.bind(this)}
              nextStep={this.props.nextStep}
              t={this.props.t}/>
            : null
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
      </Box>
    );
  }
}

export default Transactions;
