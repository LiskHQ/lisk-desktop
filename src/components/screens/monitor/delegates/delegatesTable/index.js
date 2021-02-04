import React from 'react';
import { compose } from 'redux';
import withLocalSort from '../../../../../utils/withLocalSort';
import Table from '../../../../toolbox/table';
import DelegateRow from './delegateRow';
import header from './tableHeader';

const TableWrapper = compose(
  withLocalSort('delegates', 'rank:asc'),
)(({
  delegates, handleLoadMore, t, activeTab,
  changeSort, sort, canLoadMore, forgingTimes,
}) => (
  <Table
    data={delegates.data}
    isLoading={delegates.isLoading}
    row={DelegateRow}
    loadData={handleLoadMore}
    additionalRowProps={{
      t,
      forgingTimes,
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

const DelegatesTable = ({
  standByDelegates,
  changeSort,
  delegates,
  filters,
  sort,
  t,
  activeTab,
  forgingTimes,
}) => {
  const handleLoadMore = () => {
    delegates.loadData(Object.keys(filters).reduce((acc, key) => ({
      ...acc,
      ...(filters[key] && { [key]: filters[key] }),
    }), {
      offset: standByDelegates.meta.count + standByDelegates.meta.offset,
    }));
  };

  const canLoadMore = activeTab === 'active' || !standByDelegates.meta
    ? false
    : standByDelegates.meta.count + standByDelegates.meta.offset < standByDelegates.meta.total;

  delegates = activeTab === 'active'
    ? filterDelegates(delegates, filters)
    : filterDelegates(standByDelegates, filters);

  return (
    <TableWrapper
      delegates={delegates}
      activeTab={activeTab}
      handleLoadMore={handleLoadMore}
      t={t}
      forgingTimes={forgingTimes}
      changeSort={changeSort}
      sort={sort}
      canLoadMore={canLoadMore}
    />
  );
};

export default DelegatesTable;
