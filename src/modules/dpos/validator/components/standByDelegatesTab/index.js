import React, { useContext } from 'react';
import DelegateTabContext from '../../context/delegateTabContext';
import DelegatesTable from '../delegatesTable';

const StandByDelegatesTab = () => {
  const {
    blocks, standByDelegates, filters, watchList, t, activeTab,
  } = useContext(DelegateTabContext);
  return (
    <DelegatesTable
      blocks={blocks}
      standByDelegates={standByDelegates}
      filters={filters}
      watchList={watchList}
      t={t}
      activeTab={activeTab}
    />
  );
};

export default StandByDelegatesTab;
