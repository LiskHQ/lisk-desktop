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
  const queryConfig = useMemo(() => {
    const result = { config: { params: { ...filters, ...sort && { sort } } } };

    if (activeTab === 'standby') {
      result.config.params = {
        ...result.config.params,
        status: 'standby,ineligible',
      };
      return result;
    }
    if (activeTab === 'active') {
      result.config.params = {
        ...result.config.params,
        limit: ROUND_LENGTH,
      };
      return result;
    }
    if (activeTab === 'sanctioned') {
      result.config.params = {
        ...result.config.params,
        status: 'punished,banned',
      };
      return result;
    }
    if (activeTab === 'watched') {
      result.config.params = {
        ...result.config.params,
        addressList: watchList,
      };
      return result;
    }

    return result;
  }, [activeTab, sort, filters]);

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
