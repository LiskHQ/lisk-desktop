import React from 'react';
import Table from 'src/theme/table';
import VoteRow from './voteRow';
import header from './tableHeader';

const LatestVotes = ({ votes, t, delegates }) => {
  const canLoadMore = votes.meta ? votes.data.length < votes.meta.total : false;

  const handleLoadMore = () => {
    votes.loadData({ offset: votes.meta.count + votes.meta.offset });
  };

  return (
    <Table
      data={votes.data}
      isLoading={votes.isLoading}
      row={VoteRow}
      additionalRowProps={{
        t,
        delegates: delegates.data,
      }}
      header={header(t)}
      loadData={handleLoadMore}
      canLoadMore={canLoadMore}
    />
  );
};

export default LatestVotes;
