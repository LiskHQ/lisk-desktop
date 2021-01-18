import React from 'react';
import Table from '../../../../toolbox/table';
import { MAX_BLOCKS_FORGED } from '../../../../../constants/delegates';
import DelegateRow from './delegateRow';
import header from './tableHeader';

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
      offset: delegates.data.length,
    }));
  };

  const canLoadMore = activeTab === 'active' || !standByDelegates.meta
    ? false
    : standByDelegates.data.length < (standByDelegates.meta.total - MAX_BLOCKS_FORGED);

  delegates = activeTab === 'active'
    ? filterDelegates(delegates, filters)
    : filterDelegates(standByDelegates, filters);

  return (
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
  );
};

export default DelegatesTable;
