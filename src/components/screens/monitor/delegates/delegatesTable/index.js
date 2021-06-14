import React from 'react';
import { compose } from 'redux';
import withLocalSort from '@utils/withLocalSort';
import Table from '@toolbox/table';
import DelegateRow from './delegateRow';
import header from './tableHeader';

const TableWrapper = compose(
  withLocalSort('delegates', 'forgingTime:asc', {
    forgingTime: (a, b, direction) =>
      ((a.nextForgingTime > b.nextForgingTime) ? 1 : -1) * (direction === 'asc' ? 1 : -1),
  }),
)(({
  delegates, handleLoadMore, t, activeTab, blocks,
  changeSort, sort, canLoadMore, watchList, setActiveTab,
}) => (
  <Table
    data={delegates.data}
    isLoading={delegates.isLoading}
    row={DelegateRow}
    loadData={handleLoadMore}
    additionalRowProps={{
      t,
      activeTab,
      watchList,
      setActiveTab,
      blocks,
    }}
    header={header(activeTab, changeSort, t)}
    currentSort={sort}
    canLoadMore={canLoadMore}
  />
));

const filterDelegates = (delegates, filters) => ({
  ...delegates,
  data: filters.search || filters.address
    ? delegates.data.filter(delegate =>
      delegate.username.includes(filters.search)
        && (!filters.address || filters.address.includes(delegate.address)))
    : delegates.data,
});

const selectDelegates = ({
  activeTab, delegates, standByDelegates, sanctionedDelegates,
  watchedDelegates, filters, watchList,
}) => {
  switch (activeTab) {
    case 'active':
      return filterDelegates(delegates, filters);

    case 'standby':
      return filterDelegates(standByDelegates, filters);

    case 'sanctioned':
      return filterDelegates(sanctionedDelegates, filters);

    case 'watched':
      return filterDelegates(watchedDelegates, { search: filters.search || '', address: watchList });

    default:
      return undefined;
  }
};

const DelegatesTable = ({
  setActiveTab,
  delegates,
  watchList,
  watchedDelegates,
  standByDelegates,
  sanctionedDelegates,
  activeTab,
  changeSort,
  blocks,
  filters,
  sort,
  t,
}) => {
  const delegatesToShow = selectDelegates({
    activeTab,
    delegates,
    standByDelegates,
    sanctionedDelegates,
    watchedDelegates,
    filters,
    watchList,
  });

  const canLoadMore = activeTab === 'standby' && (standByDelegates.meta?.offset + standByDelegates.meta?.count) < standByDelegates.meta?.total;

  const handleLoadMore = () => {
    delegatesToShow.loadData(Object.keys(filters).reduce((acc, key) => ({
      ...acc,
      ...(filters[key] && { [key]: filters[key] }),
    }), {
      offset: delegatesToShow.meta.count + delegatesToShow.meta.offset,
    }));
  };

  return (
    <TableWrapper
      delegates={delegatesToShow}
      blocks={blocks}
      setActiveTab={setActiveTab}
      watchList={watchList}
      handleLoadMore={handleLoadMore}
      t={t}
      activeTab={activeTab}
      changeSort={changeSort}
      sort={sort}
      canLoadMore={canLoadMore}
    />
  );
};

export default DelegatesTable;
