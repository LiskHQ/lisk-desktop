import React from 'react';
import { compose } from 'redux';
import withLocalSort from '../../../../../utils/withLocalSort';
import Table from '../../../../toolbox/table';
import DelegateRow from './delegateRow';
import header from './tableHeader';

const TableWrapper = compose(
  withLocalSort('delegates', 'rank:asc', {
    forgingTime: (a, b, direction) => {
      if (!a.forgingTime) return 1;
      if (!b.forgingTime) return -1;
      return ((a.forgingTime.time > b.forgingTime.time) ? 1 : -1) * (direction === 'asc' ? 1 : -1);
    },
  }),
)(({
  delegates, handleLoadMore, t, activeTab,
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
    }}
    header={header(activeTab, changeSort, t)}
    currentSort={sort}
    canLoadMore={canLoadMore}
  />
));

const filterDelegates = (delegates, filters) => ({
  ...delegates,
  data: filters.search
    ? delegates.data.filter(delegate => delegate.username.includes(filters.search))
    : delegates.data,
});

const selectDelegates = ({
  activeTab, delegates, standByDelegates, sanctionedDelegates,
  watchedDelegates, filters,
}) => {
  switch (activeTab) {
    case 'active':
      return filterDelegates(delegates, filters);

    case 'standby':
      return filterDelegates(standByDelegates, filters);

    case 'sanctioned':
      return filterDelegates(sanctionedDelegates, filters);

    case 'watched':
      return filterDelegates(watchedDelegates, filters);

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
  filters,
  sort,
  t,
}) => {
  const delegatesToShow = selectDelegates({
    activeTab, delegates, standByDelegates, sanctionedDelegates, watchedDelegates, filters,
  });

  const canLoadMore = activeTab === 'standby' && standByDelegates.data.length < (standByDelegates.meta.total - standByDelegates.meta.offset);

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
