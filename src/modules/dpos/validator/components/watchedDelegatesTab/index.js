/* istanbul ignore file */
import React, { useContext } from 'react';
import DelegateTabContext from '../../context/delegateTabContext';
import DelegatesTable from '../delegatesTable';

const WatchedDelegatesTab = () => {
  const {
    blocks, watchedDelegates, filters, watchList, t, activeTab, setActiveTab,
  } = useContext(DelegateTabContext);
  return (
    <DelegatesTable
      blocks={blocks}
      watchedDelegates={watchedDelegates}
      filters={filters}
      watchList={watchList}
      t={t}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
    />
  );
};

export default WatchedDelegatesTab;
