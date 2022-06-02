import React from 'react';
import { useTranslation } from 'react-i18next';
import DelegatesTable from '../delegatesTable';

const SanctionedDelegatesTab = ({
  blocks, sanctionedDelegates, filters, watchList, activeTab,
}) => {
  const { t } = useTranslation();
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
