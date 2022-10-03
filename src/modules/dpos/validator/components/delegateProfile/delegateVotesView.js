import React, { useCallback, useMemo, useRef, useState } from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { useTranslation } from 'react-i18next';

import Box from '@theme/box';
import BoxContent from '@theme/box/content';
import BoxHeader from '@theme/box/header';
import { Input } from 'src/theme';
import { QueryTable } from 'src/theme/QueryTable';
import { useFilter } from 'src/modules/common/hooks';
import VoterRow from './voterRow';
import tableHeader from './votersTableHeader';
import styles from './delegateProfile.css';
import { useReceivedVotes } from '../../hooks/queries';

const DelegateVotesView = () => {
  const { t } = useTranslation();
  const [searchInput, setSearchInput] = useState('');
  const { filters, applyFilters } = useFilter();
  const timeout = useRef();

  const { data: voterData } = useReceivedVotes({
    config: { params: filters },
  });

  const handleFilter = useCallback(
    ({ target: { search } }) => {
      setSearchInput(search);
      clearTimeout(timeout.current);

      timeout.current = setTimeout(() => {
        console.log('---');
        applyFilters({ search });
      }, 500);
    },
    [filters, searchInput]
  );

  const voter = useMemo(() => voterData?.data || { votes: [] }, [voterData]);

  const voterInfo = searchInput
    ? voter.votes.filter(
        (v) => v.username?.includes(searchInput) || v.address?.includes(searchInput)
      )
    : voter.votes;

  const emptyMessage = searchInput
    ? t('This account does not have any voter for the given address.')
    : t('This account does not have any voters.');
  // console.log('---', filters);
  return (
    <div className={`${grid.row} ${styles.votesWrapper}`}>
      <Box className={`${grid.col} ${grid['col-xs-12']}`}>
        <BoxHeader>
          <h1>
            <span>{t('Voters')}</span>
            <span className={styles.totalVotes}>{`(${voterData?.meta?.total || '...'})`}</span>
          </h1>
          {voter.votes.length > 0 && (
            <span>
              <Input
                onChange={handleFilter}
                value={searchInput}
                className="filter-by-address"
                size="m"
                placeholder={t('Filter by address...')}
              />
            </span>
          )}
        </BoxHeader>
        <BoxContent
          className={`${grid.col} ${grid['col-xs-12']} ${
            voterInfo.length ? styles.votesContainer : ''
          } votes-container`}
        >
          <QueryTable
            queryHook={useReceivedVotes}
            queryConfig={{ config: { params: filters } }}
            transformResponse={({ votes } = {}) => votes}
            iterationKey="address"
            emptyState={{ message: emptyMessage }}
            row={VoterRow}
            additionalRowProps={{
              t,
            }}
            header={tableHeader(t)}
          />
        </BoxContent>
      </Box>
    </div>
  );
};

export default DelegateVotesView;
