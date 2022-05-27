import React from 'react';
import DelegatesTable from '../delegatesTable';

const StandByDelegatesTab = ({
  blocks,
  standByDelegates,
  filters,
  watchList,
  t,
  activeTab,
}) => (
  <DelegatesTable
    blocks={blocks}
    standByDelegates={standByDelegates}
    filters={filters}
    watchList={watchList}
    t={t}
    activeTab={activeTab}
  />
);

export default StandByDelegatesTab;
