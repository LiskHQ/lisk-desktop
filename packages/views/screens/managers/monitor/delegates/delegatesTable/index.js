import React from 'react';
import { compose } from 'redux';
import withLocalSort from '@common/utilities/withLocalSort';
import Table from '@basics/table';
import { DEFAULT_STANDBY_THRESHOLD } from '@dpos/validator/constants';
import DelegateRow from './delegateRow';
import header from './tableHeader';

const TableWrapper = compose(
  withLocalSort('delegates', 'forgingTime:asc', {
    forgingTime: (a, b, direction) =>
      ((a.nextForgingTime > b.nextForgingTime) ? 1 : -1) * (direction === 'asc' ? 1 : -1),
    status: (a, b, direction) => {
      if (a.status === 'active') {
        return 1 * (direction === 'asc' ? 1 : -1);
      }
      if (b.status === 'active' || a.status !== 'standby') {
        return -1 * (direction === 'asc' ? 1 : -1);
      }
      if (a.voteWeight < DEFAULT_STANDBY_THRESHOLD) {
        return -1 * (direction === 'asc' ? 1 : -1);
      }
      if (b.voteWeight < DEFAULT_STANDBY_THRESHOLD) {
        return 1 * (direction === 'asc' ? 1 : -1);
      }
      return 0;
    },
    sanctionedStatus: (a, b, direction) => ((direction === 'asc' ? a.status > b.status : b.status > a.status) ? 1 : -1),
  }),
)(({
  delegates, handleLoadMore, t, activeTab, blocks,
  changeSort, sort, canLoadMore, watchList, setActiveTab,
}) => (
  <Table
    data={delegates.data}
    error={delegates.error}
    isLoading={delegates.isLoading}
    emptyState={{ message: t('No {{activeTab}} delegates found.', { activeTab }) }}
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

const shouldAllowLoadMore = (activeTab, standByDelegates, sanctionedDelegates) => {
  if (activeTab === 'standby') {
    return (standByDelegates.meta?.offset + standByDelegates.meta?.count)
      < standByDelegates.meta?.total;
  }
  if (activeTab === 'sanctioned') {
    return (sanctionedDelegates.meta?.offset + sanctionedDelegates.meta?.count)
      < sanctionedDelegates.meta?.total;
  }

  return false;
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

  const canLoadMore = shouldAllowLoadMore(activeTab, standByDelegates, sanctionedDelegates);

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
