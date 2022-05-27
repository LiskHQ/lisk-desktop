import React from 'react';
import DelegatesTable from '../delegatesTable';

const ActiveDelegatesTab = ({
  blocks,
  delegatesWithForgingTimes,
  filters,
  watchList,
  t,
  activeTab,
}) => (
  <DelegatesTable
    blocks={blocks}
    delegates={delegatesWithForgingTimes}
    filters={filters}
    watchList={watchList}
    t={t}
    activeTab={activeTab}
  />
);

export default ActiveDelegatesTab;
