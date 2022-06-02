import React from 'react';
import { useTranslation } from 'react-i18next';
import DelegatesTable from '../delegatesTable';

const WatchedDelegatesTab = ({
  blocks, watchedDelegates, filters, watchList, activeTab, setActiveTab,
}) => {
  const { t } = useTranslation();
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
