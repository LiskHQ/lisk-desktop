import React from 'react';
import { connect } from 'react-redux';
import txFilters from '../../constants/transactionFilters';
import Piwik from '../../utils/piwik';
import FilterContainer from './filters/filterContainer';
import FilterBar from './filters/filterBar';
import TransactionsList from './transactionsList';
import Tabs from '../toolbox/tabs';
import styles from './transactions.css';

class TransactionsOverview extends React.Component {
  constructor(props) {
    super(props);

    this.props.onInit();
    this.isActiveFilter = this.isActiveFilter.bind(this);
    this.setTransactionsFilter = this.setTransactionsFilter.bind(this);
  }

  // eslint-disable-next-line class-methods-use-this
  isSmallScreen() {
    return window.innerWidth <= 1024;
  }

  isActiveFilter(filter) {
    const { activeFilter } = this.props;
    return (!activeFilter && filter === txFilters.all)
      || (activeFilter === filter);
  }

  setTransactionsFilter(filter) {
    Piwik.trackingEvent('TransactionsOverview', 'button', 'Set transactions filter');
    this.props.onFilterSet(filter.value);
  }

  generateFilters() {
    return [
      {
        name: this.props.t('All transactions'),
        value: txFilters.all,
        className: 'filter-all',
      },
      ...(this.props.activeToken !== 'BTC' ? [
        {
          name: this.props.t('Incoming transactions'),
          value: txFilters.incoming,
          className: 'filter-in',
        },
        {
          name: this.props.t('Outgoing transactions'),
          value: txFilters.outgoing,
          className: 'filter-out',
        },
      ] : []),
    ];
  }

  render() {
    const isSmallScreen = this.isSmallScreen();
    const filters = this.generateFilters();

    return (
      <div className={`${styles.transactions} transactions`}>
        <div className={styles.container}>
          <Tabs
            tabs={filters}
            className="transaction-filter-item"
            isActive={this.isActiveFilter}
            onClick={this.setTransactionsFilter}
          />
          {this.props.activeToken !== 'BTC'
            ? (
              <div className={styles.items}>
                <FilterContainer
                  updateCustomFilters={this.props.updateCustomFilters}
                  saveFilters={this.props.saveFilters}
                  customFilters={this.props.customFilters}
                />
              </div>
            )
            : null}
        </div>
        {this.props.activeCustomFilters
          && Object.values(this.props.activeCustomFilters).find(filter => filter) ? (
            <FilterBar
              clearFilter={this.props.clearFilter}
              clearAllFilters={this.props.clearAllFilters}
              customFilters={this.props.activeCustomFilters}
              results={this.props.count}
              t={this.props.t}
            />
          ) : null}
        <TransactionsList
          bookmarks={this.props.bookmarks}
          canLoadMore={this.props.canLoadMore}
          transactions={this.props.transactions}
          filter={filters[this.props.activeFilter]}
          address={this.props.address}
          publicKey={this.props.publicKey}
          history={this.props.history}
          onClick={props => this.props.onTransactionRowClick(props)}
          loading={this.props.loading}
          onLoadMore={this.props.onLoadMore}
          isSmallScreen={isSmallScreen}
          activeToken={this.props.activeToken}
        />
      </div>
    );
  }
}
const mapStateToProps = state => ({
  bookmarks: state.bookmarks,
  account: state.account,
});

export default connect(mapStateToProps)(TransactionsOverview);
