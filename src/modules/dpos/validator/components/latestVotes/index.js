import React from 'react';
import { useTranslation } from 'react-i18next';
import Table from 'src/theme/table';
import TransactionRow from '@transaction/components/TransactionRow';
import header from './tableHeader';

const LatestVotes = ({ votes, delegates }) => {
  const { t } = useTranslation();
  const canLoadMore = votes.meta ? votes.data.length < votes.meta.total : false;

  const handleLoadMore = () => {
    votes.loadData({ offset: votes.meta.count + votes.meta.offset });
  };

  return (
    <Table
      data={votes.data}
      isLoading={votes.isLoading}
      row={TransactionRow}
      additionalRowProps={{
        t,
        delegates: delegates.data,
        layout: 'vote',
        activeToken: 'LSK',
      }}
      header={header(t)}
      loadData={handleLoadMore}
      canLoadMore={canLoadMore}
    />
  );
};

export default LatestVotes;
