import React from 'react';
import Waypoint from 'react-waypoint';
import CopyToClipboard from '../copyToClipboard';
import TransactionList from './transactionList';
import LiskAmount from '../liskAmount';
import Box from '../box';
import styles from './transactions.css';
import txFilters from './../../constants/transactionFilters';

class Transactions extends React.Component {
  constructor(props) {
    super(props);
    this.canLoadMore = true;
  }

  loadTransactions(filter, offset) {
    this.props.transactionsRequested({
      activePeer: this.props.activePeer,
      address: this.props.address,
      limit: 20,
      offset,
      filter,
    });
  }

  loadMore() {
    if (this.canLoadMore) {
      this.canLoadMore = false;
      this.loadTransactions(this.props.activeFilter, this.props.transactions.length);
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

  componentWillUnmount() {
    this.setActiveFilter(txFilters.all);
  }

  setActiveFilter(filter) {
    this.props.transactionsReset({ filter });
    this.loadTransactions(filter);
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
      },
      {
        name: this.isSmallScreen() ? this.props.t('In') : this.props.t('Incoming'),
        value: txFilters.incoming,
      },
      {
        name: this.isSmallScreen() ? this.props.t('Out') : this.props.t('Outgoing'),
        value: txFilters.outgoing,
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
            <li key={i} className={`${styles.item} ${this.isActiveFilter(filter.value) ? styles.active : ''}`}
              onClick={this.setActiveFilter.bind(this, filter.value)}>{filter.name}</li>
          ))}
        </ul>
        <TransactionList
          address={this.props.address}
          transactions={this.props.transactions}
          loadMore={this.loadMore.bind(this)}
          nextStep={this.props.nextStep}
          t={this.props.t} />
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
