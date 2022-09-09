import React, { useState } from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';

import Box from '@theme/box';
import BoxContent from '@theme/box/content';
import BoxHeader from '@theme/box/header';
import { Input } from 'src/theme';
import Table from '@theme/table';
import VoterRow from './voterRow';
import tableHeader from './votersTableHeader';
import styles from './delegateProfile.css';

const DelegateVotesView = ({ voters, t }) => {
  const [searchInput, setSearchInput] = useState('');

  const onInputChange = ({ target }) => {
    setSearchInput(target.value);
  };

  const handleLoadMore = () => {
    voters.loadData({
      aggregate: true,
      offset: voters.meta.count + voters.meta.offset,
    });
  };

  const votersInfo = searchInput
    ? voters.data.votes.filter(
        (v) => v.username?.includes(searchInput) || v.address?.includes(searchInput)
      )
    : voters.data.votes;
  const canLoadMoreData = voters.meta && voters.meta.total > votersInfo.length && !searchInput;
  const emptyMessage = searchInput
    ? t('This account does not have any voter for the given address.')
    : t('This account does not have any voters.');

  return (
    <div className={`${grid.row} ${styles.votesWrapper}`}>
      <Box className={`${grid.col} ${grid['col-xs-12']}`}>
        <BoxHeader>
          <h1>
            <span>{t('Voters')}</span>
            <span className={styles.totalVotes}>
              {`(${voters.meta ? voters.meta.total : '...'})`}
            </span>
          </h1>
          {voters.data.votes.length > 0 && (
            <span>
              <Input
                onChange={onInputChange}
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
            votersInfo.length ? styles.votesContainer : ''
          } votes-container`}
        >
          <Table
            data={votersInfo}
            canLoadMore={canLoadMoreData}
            isLoading={voters.isLoading}
            iterationKey="address"
            emptyState={{ message: emptyMessage }}
            row={VoterRow}
            additionalRowProps={{
              t,
            }}
            loadData={handleLoadMore}
            header={tableHeader(t)}
          />
        </BoxContent>
      </Box>
    </div>
  );
};

export default DelegateVotesView;
