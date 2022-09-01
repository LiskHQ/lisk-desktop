import React from 'react';
import Table from '../table';

// eslint-disable-next-line import/prefer-default-export
export const QueryTable = ({ queryHook, queryConfig, ...props }) => {
  const {
    // data: response,
    error,
    isLoading,
    isFetching,
    fetchNextPage,
    hasNextPage,
  } = queryHook(queryConfig);
  return (
    <Table
      data={[]}
      isLoading={isLoading}
      isFetching={isFetching}
      loadData={fetchNextPage}
      canLoadMore={hasNextPage}
      error={error}
      {...props}
    />
  );
};
