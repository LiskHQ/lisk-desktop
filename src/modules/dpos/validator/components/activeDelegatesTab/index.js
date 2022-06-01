import React, { useContext } from 'react';
import DelegateTabContext from '../../context/delegateTabContext';
import DelegatesTable from '../delegatesTable';

const ActiveDelegatesTab = () => {
  const {
    blocks, delegatesWithForgingTimes, filters, watchList, t, activeTab,
  } = useContext(DelegateTabContext);
  return (
    <DelegatesTable
      blocks={blocks}
      delegates={delegatesWithForgingTimes}
      filters={filters}
      watchList={watchList}
      t={t}
      activeTab={activeTab}
    />
  );
};

export default ActiveDelegatesTab;
