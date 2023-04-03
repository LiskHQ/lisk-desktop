import React, { useCallback, useMemo, useRef, useState } from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { useTranslation } from 'react-i18next';

import Box from '@theme/box';
import BoxContent from '@theme/box/content';
import BoxHeader from '@theme/box/header';
import { Input } from 'src/theme';
import { QueryTable } from 'src/theme/QueryTable';
import { useFilter } from 'src/modules/common/hooks';
import Skeleton from 'src/modules/common/components/skeleton';
import StakerRow from './StakerRow';
import tableHeader from './StakersTableHeader';
import styles from './ValidatorProfile.css';
import { useReceivedStakes } from '../../hooks/queries';

const ValidatorStakesView = ({ address }) => {
  const { t } = useTranslation();
  const [searchInput, setSearchInput] = useState('');
  const { filters, applyFilters } = useFilter({ address });
  const timeout = useRef();

  const { data: stakerData } = useReceivedStakes({
    config: { params: filters },
  });

  const handleFilter = useCallback(
    ({ target: { value: search } }) => {
      setSearchInput(search);
      clearTimeout(timeout.current);

      timeout.current = setTimeout(() => {
        applyFilters({ search });
      }, 500);
    },
    [filters, searchInput]
  );

  const stakers = useMemo(() => stakerData?.data.stakers || { stakers: [] }, [stakerData]);

  const emptyMessage = searchInput
    ? t('This account does not have any staker for the given address.')
    : t('This account does not have any stakers.');

  return (
    <div className={`${grid.row} ${styles.stakesWrapper}`}>
      <Box className={`${grid.col} ${grid['col-xs-12']}`}>
        <BoxHeader>
          <h1>
            <span>{t('Stakers')}</span>
            {!!stakerData?.meta?.total && (
              <span className={styles.totalStakes}>{`(${stakerData?.meta?.total})`}</span>
            )}
          </h1>
          {(stakers.length > 0 || !!searchInput) && (
            <span>
              <Input
                onChange={handleFilter}
                value={searchInput}
                name="addressFilter"
                className="filter-by-address"
                size="m"
                placeholder={t('Filter by address...')}
              />
            </span>
          )}
        </BoxHeader>
        <BoxContent className={`${grid.col} ${grid['col-xs-12']} ${styles.stakesContainer}`}>
          <QueryTable
            queryHook={useReceivedStakes}
            queryConfig={{ config: { params: filters } }}
            transformResponse={({ stakers: stakerResult } = {}) => stakerResult || []}
            iterationKey="address"
            emptyState={{ message: emptyMessage }}
            row={StakerRow}
            additionalRowProps={{
              t,
            }}
            header={tableHeader(t)}
            customLoader={<Skeleton width="100%" />}
          />
        </BoxContent>
      </Box>
    </div>
  );
};

export default ValidatorStakesView;
