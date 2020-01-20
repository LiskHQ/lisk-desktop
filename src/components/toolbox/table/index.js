import React, { Fragment } from 'react';
import Loading from './loading';
import Empty from './empty';
import Error from './error';
import List from './list';
import LoadMoreButton from './loadMoreButton';

const Table = ({
  data,
  loadData,
  header,
  row,
  currentSort,
  loadingState,
  isLoading,
  emptyState,
  iterationKey,
  canLoadMore,
  error,
}) => {
  const Row = row;
  return (
    <Fragment>
      <List
        data={data}
        header={header}
        currentSort={currentSort}
        iterationKey={iterationKey}
        Row={Row}
        error={error}
      />
      <Loading
        data={loadingState}
        headerInfo={header}
        isLoading={isLoading}
      />
      <Empty
        data={emptyState}
        error={error}
        isLoading={isLoading}
        isListEmpty={data.length === 0}
      />
      <Error data={error} isLoading={isLoading} />
      <LoadMoreButton
        onClick={loadData}
        dataLength={data.length}
        canLoadMore={canLoadMore}
        error={error}
      />
    </Fragment>
  );
};

export default Table;
