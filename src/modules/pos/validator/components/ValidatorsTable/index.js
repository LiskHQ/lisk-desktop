/* istanbul ignore file */
import React, { useMemo, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { QueryTable } from 'src/theme/QueryTable';
import { useSort } from 'src/modules/common/hooks';
import { useBlocks } from 'src/modules/block/hooks/queries/useBlocks';
import { useValidators } from '../../hooks/queries';
import { useGenerators } from '../../hooks/queries/useGenerators';
import ValidatorRow from './ValidatorRow';
import header from './TableHeader';
import { ROUND_LENGTH } from '../../consts';

// eslint-disable-next-line max-statements
const ValidatorsTable = ({ setActiveTab, activeTab, blocks, filters }) => {
  const { t } = useTranslation();
  const watchList = useSelector((state) => state.watchList);
  const queryHook = activeTab === 'active' ? useGenerators : useValidators;
  const { data: { data: latestBlocks = [] } = {} } = useBlocks({
    config: { params: { limit: 100 } },
    options: {
      refetchInterval: 10000,
    },
  });
  const { sort, toggleSort } = useSort();
  const forgedBlocksInRound = latestBlocks[0]?.height % ROUND_LENGTH;
  const remainingBlocksInRound = ROUND_LENGTH - forgedBlocksInRound;

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
    config: { params: { limit: ROUND_LENGTH, status: 'active' } },
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
      return generatorsData.map((gen, index) => {
        const haveForgedInRound = latestBlocks
          ?.filter((_, i) => forgedBlocksInRound >= i)
          .map((genData) => genData.generator.name);
        if (haveForgedInRound?.indexOf(gen.name) > -1) {
          return { ...gen, ...normalizedValidators[gen.address], state: 'generating' };
        }
        if (index < remainingBlocksInRound) {
          return { ...gen, ...normalizedValidators[gen.address], state: 'awaitingSlot' };
        }
        return { ...gen, ...normalizedValidators[gen.address], state: 'missedBlock' };
      });
    },
    [validators, latestBlocks]
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
        illustration: 'emptyValidatorsIllustration',
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
