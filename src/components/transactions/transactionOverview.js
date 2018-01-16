import React from 'react';
import Waypoint from 'react-waypoint';
import CopyToClipboard from '../copyToClipboard';
import TransactionList from './transactionList';
import LiskAmount from '../liskAmount';
import Box from '../box';
import styles from './transactions.css';
import txFilters from './../../constants/transactionFilters';

class Transactions extends React.Component {
  constructor() {
    super();
    this.canLoadMore = true;
    this.state = {
      activeFilter: txFilters.all,
      transactionsReset: false,
    };
  }

  loadTransactions() {
    this.props.transactionsRequested({
      activePeer: this.props.activePeer,
      address: this.props.address,
      limit: 20,
      offset: this.props.transactions.length,
      filter: this.state.activeFilter,
    });
  }

  loadMore() {
    if (this.canLoadMore) {
      this.canLoadMore = false;
      this.loadTransactions();
    }
  }

  // eslint-disable-next-line class-methods-use-this
  isSmallScreen() {
    return window.innerWidth <= 768;
  }

  componentDidUpdate() {
    if (this.state.transactionsReset) {
      this.loadTransactions();
      this.setState({ transactionsReset: false });
    }

    const { count, transactions } = this.props;
    this.canLoadMore = count === null || count > transactions.length;
  }

  setActiveFilter(filter) {
    this.setState({ activeFilter: filter });
    this.props.transactionsReset({ filter });
    this.setState({ transactionsReset: true });
  }

  isActiveFilter(filter) {
    return this.state.activeFilter === filter;
  }

  render() {
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
          <li className={`${styles.item} ${this.isActiveFilter(txFilters.all) ? styles.active : ''}`}
            onClick={this.setActiveFilter.bind(this, txFilters.all)}>{this.props.t('All')}</li>
          <li className={`${styles.item} ${this.isActiveFilter(txFilters.incoming) ? styles.active : ''}`}
            onClick={this.setActiveFilter.bind(this, txFilters.incoming)}>{this.isSmallScreen() ? this.props.t('In') : this.props.t('Incoming')}</li>
          <li className={`${styles.item} ${this.isActiveFilter(txFilters.outgoing) ? styles.active : ''}`}
            onClick={this.setActiveFilter.bind(this, txFilters.outgoing)}>{this.isSmallScreen() ? this.props.t('Out') : this.props.t('Outgoing')}</li>
          <li className={styles.item}>{this.props.t('Other')}</li>
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
