import React from 'react';
import DelegatesTable from '../delegatesTable';

const SanctionedDelegatesTab = ({
  blocks,
  sanctionedDelegates,
  filters,
  watchList,
  t,
  activeTab,
}) => (
  <DelegatesTable
    blocks={blocks}
    sanctionedDelegates={sanctionedDelegates}
    filters={filters}
    watchList={watchList}
    t={t}
    activeTab={activeTab}
  />
);

export default SanctionedDelegatesTab;
