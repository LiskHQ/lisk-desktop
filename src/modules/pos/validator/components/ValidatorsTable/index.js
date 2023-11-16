/* istanbul ignore file */
import React, { useMemo, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { QueryTable } from 'src/theme/QueryTable';
import { useSort } from 'src/modules/common/hooks';
import { useBlocks } from 'src/modules/block/hooks/queries/useBlocks';
import { useGeneratorsWithUpdate, useValidators } from '@pos/validator/hooks/queries';
import ValidatorRow from './ValidatorRow';
import header from './TableHeader';
import { ROUND_LENGTH } from '../../consts';
import styles from './ValidatorsTable.css';

// eslint-disable-next-line max-statements
const ValidatorsTable = ({ setActiveTab, activeTab, blocks, filters }) => {
  const { t } = useTranslation();
  const watchList = useSelector((state) => state.watchList);
  const queryHook = (queryConfigArg) => {
    const validators = useValidators(queryConfigArg);
    const generatorsWithUpdate = useGeneratorsWithUpdate(queryConfigArg);
    return activeTab === 'active' ? generatorsWithUpdate : validators;
  };
  const { refetch, data: { data: latestBlocks = [] } = {} } = useBlocks({
    config: { params: { limit: 100 } },
  });
  const { sort, toggleSort } = useSort();
  const forgedBlocksInRound = latestBlocks[0]?.height % ROUND_LENGTH;
  const remainingBlocksInRound = ROUND_LENGTH - forgedBlocksInRound;
  const [sortParam, sortDirection] = sort?.split?.(':') || [];

  const queryConfig = useMemo(
    () => ({
      config: {
        params: {
          ...filters,
          ...(activeTab === 'standby' && { status: 'standby,ineligible' }),
          ...(activeTab === 'active' && { limit: ROUND_LENGTH }),
          ...(activeTab === 'sanctioned' && { status: 'punished,banned' }),
          ...(activeTab === 'watched' && { address: watchList?.toString() }),
        },
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
      if (!generatorsData || !validators) return [];

      const normalizedValidators = validators.data.reduce(
        (acc, val) => ({ ...acc, [val.address]: val }),
        {}
      );

      const generators = generatorsData.map((generator, index) => {
        const haveForgedInRound = latestBlocks
          ?.filter((_, i) => forgedBlocksInRound >= i)
          .map((genData) => genData.generator.name);

        if (haveForgedInRound?.indexOf(generator.name) > -1) {
          return { ...generator, ...normalizedValidators[generator.address], state: 'generating' };
        }

        if (index < remainingBlocksInRound) {
          return {
            ...generator,
            ...normalizedValidators[generator.address],
            state: 'awaitingSlot',
          };
        }

        return { ...generator, ...normalizedValidators[generator.address], state: 'missedBlock' };
      });

      if (!sortParam || !generators[0]?.[sortParam]) return generators;

      return generators.sort((a, b) => {
        if (sortDirection === 'desc' && b[sortParam] > a[sortParam]) return 1;
        if (sortDirection === 'desc' && b[sortParam] < a[sortParam]) return -1;
        if (sortDirection === 'asc' && b[sortParam] > a[sortParam]) return -1;
        if (sortDirection === 'asc' && b[sortParam] < a[sortParam]) return 1;

        return 0;
      });
    },
    [validators, latestBlocks, sort]
  );

  return (
    <QueryTable
      showHeader
      button={{
        label: t('Refresh'),
        onClick: refetch,
        className: styles.loadLatestBtn,
      }}
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
