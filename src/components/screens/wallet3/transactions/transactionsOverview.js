import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import txFilters from '../../../../constants/transactionFilters';
import Piwik from '../../../../utils/piwik';
import FilterContainer from './filters/filterContainer';
import FilterBar from '../../../shared/filterBar';
import TransactionsList from './transactionsList';
import Tabs from '../../../toolbox/tabs';
import styles from './transactions.css';

const TransactionsOverview = (props) => {
  useEffect(() => {
    props.onInit();
    return () => {
      props.onFilterSet(txFilters.all);
    };
  }, []);
  const isActiveFilter = (filter) => {
    const { activeFilter } = props;
    return (!activeFilter && filter === txFilters.all)
      || (activeFilter === filter);
  };
  const setTransactionsFilter = (filter) => {
    Piwik.trackingEvent('TransactionsOverview', 'button', 'Set transactions filter');
    props.onFilterSet(filter.value);
  };
  const { bookmarks } = useSelector(state => ({
    bookmarks: state.bookmarks,
  }));
  const filters = [
    {
      name: props.t('All transactions'),
      value: txFilters.all,
      className: 'filter-all',
    },
    ...(props.activeToken !== 'BTC' ? [
      {
        name: props.t('Incoming transactions'),
        value: txFilters.incoming,
        className: 'filter-in',
      },
      {
        name: props.t('Outgoing transactions'),
        value: txFilters.outgoing,
        className: 'filter-out',
      },
    ] : []),
  ];
  const isSmallScreen = window.innerWidth <= 1024;

  return (
    <div className={`${styles.transactions} transactions`}>
      <div className={styles.container}>
        <Tabs
          tabs={filters}
          className="transaction-filter-item"
          isActive={filter => isActiveFilter(filter)}
          onClick={filter => setTransactionsFilter(filter)}
        />
        {props.activeToken !== 'BTC'
          ? (
            <div className={styles.items}>
              <FilterContainer
                saveFilters={props.saveFilters}
                customFilters={props.activeCustomFilters}
              />
            </div>
          )
          : null}
      </div>
      {props.activeCustomFilters
        && Object.values(props.activeCustomFilters).find(filter => filter) ? (
          <FilterBar
            clearFilter={props.clearFilter}
            clearAllFilters={props.clearAllFilters}
            filters={props.activeCustomFilters}
            results={props.count}
            t={props.t}
          />
        ) : null}
      <TransactionsList
        bookmarks={bookmarks}
        canLoadMore={props.canLoadMore}
        transactions={props.transactions}
        filter={filters[props.activeFilter]}
        address={props.address}
        publicKey={props.publicKey}
        history={props.history}
        onClick={value => props.onTransactionRowClick(value)}
        loading={props.loading}
        onLoadMore={props.onLoadMore}
        isSmallScreen={isSmallScreen}
        activeToken={props.activeToken}
      />
    </div>
  );
};

export default TransactionsOverview;
