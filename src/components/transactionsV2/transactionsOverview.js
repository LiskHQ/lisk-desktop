import React from 'react';
import Waypoint from 'react-waypoint';
import { connect } from 'react-redux';
import Box from '../box';
import EmptyState from '../emptyState';
import txFilters from '../../constants/transactionFilters';
import Piwik from '../../utils/piwik';
import styles from './transactions.css';

class TransactionsOverview extends React.Component {
  constructor(props) {
    super(props);
    this.canLoadMore = true;
  }

  // eslint-disable-next-line class-methods-use-this
  isSmallScreen() {
    return window.innerWidth <= 768;
  }

  loadMore() {
    Piwik.trackingEvent('TransactionsOverview', 'button', 'Load more');
    if (this.canLoadMore) {
      this.canLoadMore = false;
      this.props.onLoadMore();
    }
  }

  isActiveFilter(filter) {
    return (!this.props.activeFilter && filter === txFilters.all) ||
      (this.props.activeFilter === filter);
  }

  setTransactionsFilter(filter) {
    Piwik.trackingEvent('TransactionsOverview', 'button', 'Set transactions filter');
    this.props.onFilterSet(filter);
  }

  shouldShowEmptyState() {
    const isLoading = this.props.loading.length > 0;
    return this.props.transactions.length === 0 && !isLoading &&
      (!this.props.activeFilter || this.props.activeFilter === txFilters.all);
  }

  generateFilters(isSmallScreen) {
    const filters = [
      {
        name: this.props.t('All transactions'),
        value: txFilters.all,
        className: 'filter-all',
      },
      {
        name: isSmallScreen ? this.props.t('In') : this.props.t('Incoming transactions'),
        value: txFilters.incoming,
        className: 'filter-in',
      },
      {
        name: isSmallScreen ? this.props.t('Out') : this.props.t('Outgoing transactions'),
        value: txFilters.outgoing,
        className: 'filter-out',
      },
    ];

    if (this.props.delegate && Object.keys(this.props.delegate).length > 0) {
      filters[txFilters.statistics] = {
        name: isSmallScreen ? this.props.t('Stats') : this.props.t('Delegate statistics'),
        value: txFilters.statistics,
        className: 'delegate-statistics',
      };
    } else {
      filters[txFilters.accountInfo] = {
        name: isSmallScreen ? this.props.t('Info') : this.props.t('Account Info'),
        value: txFilters.accountInfo,
        className: 'account-info',
      };
    }

    return filters;
  }

  render() {
    const isSmallScreen = this.isSmallScreen();
    const filters = this.generateFilters(isSmallScreen);

    return (
      <Box className={`${styles.transactions} transactions`}>
        {this.shouldShowEmptyState() ?
          <EmptyState title={this.props.t('No transactions yet')}
            message={this.props.t('The Wallet will show your recent transactions.')} /> :
          <ul className={`${styles.txFilters}`}>
            {filters.map((filter, i) => (
              <li key={i} className={`transaction-filter-item ${filter.className} ${this.isActiveFilter(filter.value) ? styles.active : ''}`}
                onClick={() => this.setTransactionsFilter(filter.value)}>
                {filter.name}
              </li>
            ))}
          </ul>
        }
        {
          // <TransactionsList
          //   filter={filters[this.props.activeFilter]}
          //   delegate={this.props.delegate}
          //   votes={this.props.votes}
          //   voters={this.props.voters}
          //   votersSize={this.props.votersSize}
          //   searchMoreVoters={this.props.searchMoreVoters}
          //   address={this.props.address}
          //   publicKey={this.props.publicKey}
          //   transactions={this.props.transactions}
          //   loadMore={this.loadMore.bind(this)}
          //   nextStep={this.props.nextStep}
          //   loading={this.isLoading()}
          //   t={this.props.t}
          //   history={this.props.history}
          //   onClick={props => this.props.onTransactionRowClick(props)}
          // />
        }
        {
          // the whole transactions box should be scrollable on XS
          // otherwise only the transaction list should be scrollable
          // (see transactionList.js)
          isSmallScreen
            && <Waypoint bottomOffset='-80%' key={this.props.transactions.length}
              onEnter={() => { this.loadMore(); }}></Waypoint>
        }
      </Box>
    );
  }
}
const mapStateToProps = state => ({
  followedAccounts: state.followedAccounts.accounts,
  peers: state.peers,
  account: state.account,
});

export default connect(mapStateToProps)(TransactionsOverview);

