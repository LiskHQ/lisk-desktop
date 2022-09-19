/* istanbul ignore file */
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { QueryTable } from 'src/theme/QueryTable';
import { useSort } from 'src/modules/common/hooks';
import { useDelegates } from '../../hooks/queries';
import { useForgersGenerator } from '../../hooks/queries/useForgersGenerator';
import DelegateRow from './delegateRow';
import header from './tableHeader';
import { ROUND_LENGTH } from '../../consts';

const DelegatesTable = ({
  setActiveTab,
  activeTab,
  blocks,
  filters,
}) => {
  const { t } = useTranslation();
  const watchList = useSelector((state) => state.watchList);
  const queryHook = activeTab === 'active' ? useForgersGenerator : useDelegates;
  const { sort, toggleSort } = useSort();

  // eslint-disable-next-line max-statements
  const queryConfig = useMemo(() => ({
      config: { 
        params: { 
          ...filters, 
          ...sort && { sort },
          ...(activeTab === 'standby' && { status: 'standby,ineligible' }),
          ...(activeTab === 'active' && { limit: ROUND_LENGTH }),
          ...(activeTab === 'sanctioned' && { status: 'punished,banned' }),
          ...(activeTab === 'watched' && { addressList: watchList }),
        } 
      }
    }), [activeTab, sort, filters]);

  return (
    <QueryTable
      showHeader
      queryHook={queryHook}
      queryConfig={queryConfig}
      row={DelegateRow}
      header={header(activeTab, toggleSort, t)}
      currentSort={sort}
      emptyState={{
        message: t('No {{activeTab}} delegates found.', { activeTab }),
      }}
      additionalRowProps={{
        t,
        activeTab,
        watchList,
        setActiveTab,
        blocks,
      }}
    />
  );
};

export default DelegatesTable;
