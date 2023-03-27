/* istanbul ignore file */
import React, { useMemo, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { QueryTable } from 'src/theme/QueryTable';
import { useSort } from 'src/modules/common/hooks';
import { useValidators } from '../../hooks/queries';
import { useGenerators } from '../../hooks/queries/useGenerators';
import ValidatorRow from './ValidatorRow';
import header from './TableHeader';
import { ROUND_LENGTH } from '../../consts';

const ValidatorsTable = ({ setActiveTab, activeTab, blocks, filters }) => {
  const { t } = useTranslation();
  const watchList = useSelector((state) => state.watchList);
  const queryHook = activeTab === 'active' ? useGenerators : useValidators;
  const { sort, toggleSort } = useSort();

  const queryConfig = useMemo(
    () => ({
      config: {
        params: {
          ...filters,
          ...(sort && { sort }),
          ...(activeTab === 'standby' && { status: 'standby,ineligible' }),
          ...(activeTab === 'active' && { limit: ROUND_LENGTH }),
          ...(activeTab === 'sanctioned' && { status: 'punished,banned' }),
          ...(activeTab === 'watched' && { address: watchList?.toString() }),
        },
      },
      options: {
        refetchInterval: activeTab === 'active' ? 10000 : false,
      },
    }),
    [activeTab, sort, filters]
  );
  const { data: validators } = useValidators({
    config: { params: { limit: 103, status: 'active' } },
    options: { enabled: activeTab === 'active' },
  });

  const transformResponse = useCallback(
    (generatorsData) => {
      if (!generatorsData || !validators) {
        return [];
      }
      const normalizedValidators = validators.data.reduce(
        (acc, val) => ({ ...acc, [val.address]: val }),
        {}
      );
      return generatorsData.map((gen) => ({
        ...gen,
        ...normalizedValidators[gen.address],
      }));
    },
    [validators]
  );

  return (
    <QueryTable
      showHeader
      queryHook={queryHook}
      queryConfig={queryConfig}
      transformResponse={transformResponse}
      row={ValidatorRow}
      header={header(activeTab, toggleSort, t)}
      currentSort={sort}
      emptyState={{
        message: t('No {{activeTab}} validators found.', { activeTab }),
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

export default ValidatorsTable;
