import React from 'react';
import DelegatesTable from '../delegatesTable';

const WatchedDelegatesTab = ({
  blocks,
  watchedDelegates,
  filters,
  watchList,
  t,
  activeTab,
}) => (
  <DelegatesTable
    blocks={blocks}
    watchedDelegates={watchedDelegates}
    filters={filters}
    watchList={watchList}
    t={t}
    activeTab={activeTab}
  />
);

export default WatchedDelegatesTab;
