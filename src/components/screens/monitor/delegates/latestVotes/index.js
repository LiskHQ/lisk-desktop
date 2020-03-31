import React, { useEffect } from 'react';
import Table from '../../../../toolbox/table';
import VotesRow from './voteRow';
import header from './tableHeader';

const LatestVotes = ({
  votes, t,
}) => {
  const handleLoadMore = () => {};
  const canLoadMore = false;

  useEffect(() => {
    votes.loadData();
  }, []);

  useEffect(() => {
    console.log('vots', votes.data);
  }, [votes]);

  return (
    <Table
      data={votes.data}
      isLoading={votes.isLoading}
      row={VotesRow}
      loadData={handleLoadMore}
      additionalRowProps={{
        t,
      }}
      header={header(t)}
      canLoadMore={canLoadMore}
    />
  );
};

export default LatestVotes;
