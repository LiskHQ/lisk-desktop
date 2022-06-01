import React, { useContext } from 'react';
import DelegateTabContext from '../../context/delegateTabContext';
import DelegatesTable from '../delegatesTable';

const SanctionedDelegatesTab = () => {
  const {
    blocks, sanctionedDelegates, filters, watchList, t, activeTab,
  } = useContext(DelegateTabContext);
  return (
    <DelegatesTable
      blocks={blocks}
      sanctionedDelegates={sanctionedDelegates}
      filters={filters}
      watchList={watchList}
      t={t}
      activeTab={activeTab}
    />
  );
};

export default SanctionedDelegatesTab;
