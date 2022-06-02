import React from 'react';
import { useTranslation } from 'react-i18next';
import DelegatesTable from '../delegatesTable';

const StandByDelegatesTab = ({
  blocks, standByDelegates, filters, watchList, activeTab,
}) => {
  const { t } = useTranslation();
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
