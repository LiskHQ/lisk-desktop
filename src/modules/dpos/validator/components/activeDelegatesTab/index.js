import React from 'react';
import { useTranslation } from 'react-i18next';
import DelegatesTable from '../delegatesTable';

const ActiveDelegatesTab = ({
  blocks, delegates, filters, watchList, activeTab,
}) => {
  const { t } = useTranslation();
  return (
    <DelegatesTable
      blocks={blocks}
      delegates={delegates}
      filters={filters}
      watchList={watchList}
      t={t}
      activeTab={activeTab}
    />
  );
};

export default ActiveDelegatesTab;
