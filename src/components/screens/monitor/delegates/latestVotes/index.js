import React from 'react';
import Table from '../../../../toolbox/table';
import VotesRow from './voteRow';
import header from './tableHeader';

const LatestVotes = ({
  votes, t,
}) => {
  const canLoadMore = false;

  return (
    <Table
      data={votes.data}
      isLoading={votes.isLoading}
      row={VotesRow}
      additionalRowProps={{
        t,
      }}
      header={header(t)}
      canLoadMore={canLoadMore}
    />
  );
};

export default LatestVotes;
