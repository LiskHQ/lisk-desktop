import React, { useState } from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';

import Box from '@toolbox/box';
import BoxContent from '@toolbox/box/content';
import BoxHeader from '@toolbox/box/header';
import { Input } from '@toolbox/inputs';
import Table from '@toolbox/table';
import VoterRow from './voterRow';
import tableHeader from './votersTableHeader';
import styles from './delegateProfile.css';

const DelegateVotesView = ({
  voters, t,
}) => {
  const [searchedAddress, setSearchedAddress] = useState();

  const onInputChange = (e) => {
    setSearchedAddress(e.target.value);
  };

  const handleLoadMore = () => {
    voters.loadData({ offset: voters.data.length });
  };

  return (
    <div className={`${grid.row} ${styles.votesWrapper}`}>
      <Box className={`${grid.col} ${grid['col-xs-12']}`}>
        <BoxHeader>
          <h1>
            <span>{t('Voters')}</span>
            <span className={styles.totalVotes}>{`(${voters.meta ? voters.meta.count : '...'})`}</span>
          </h1>
          {voters.length > 0 && (
            <span>
              <Input
                onChange={onInputChange}
                value={searchedAddress}
                className="filter-by-address"
                size="m"
                placeholder={t('Filter by address...')}
              />
            </span>
          )}
        </BoxHeader>
        <BoxContent
          className={`${grid.col} ${grid['col-xs-12']} ${voters.data.length ? styles.votesContainer : ''} votes-container`}
        >
          <Table
            data={voters.data.votes}
            canLoadMore={voters.meta && voters.data.length < voters.meta.count}
            isLoading={voters.isLoading}
            iterationKey="address"
            emptyState={{ message: t('This account doesn’t have any voters.') }}
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
