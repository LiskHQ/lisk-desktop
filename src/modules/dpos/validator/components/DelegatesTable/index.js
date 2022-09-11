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

const DelegatesTable = ({
  setActiveTab,
  activeTab,
  blocks,
}) => {
  const { t } = useTranslation();
  const watchList = useSelector((state) => state.watchList);
  const queryHook = activeTab === 'active' ? useForgersGenerator : useDelegates;
  const { sort, toggleSort } = useSort();

  // eslint-disable-next-line max-statements
  const queryConfig = useMemo(() => {
    const result = { config: { params: { sort } } };

    if (activeTab === 'standby') {
      result.config.params = { status: 'standby,ineligible' };
      return result;
    }
    if (activeTab === 'active') {
      result.config.params = { limit: 103 };
      return result;
    }
    if (activeTab === 'sanctioned') {
      result.config.params = { status: 'punished,banned' };
      return result;
    }
    if (activeTab === 'watched') {
      result.config.params = { addressList: watchList };
      return result;
    }

    return result;
  }, [activeTab, sort]);

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
