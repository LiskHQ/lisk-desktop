import React from 'react';
import Empty from './empty';
import Error from './error';
import List from './list';
import LoadMoreButton from './loadMoreButton';
import TableLoadingState from './TableLoadingState';
import styles from './table.css';

const Table = ({
  data = [],
  loadData,
  header,
  headerClassName,
  subHeader,
  row,
  currentSort,
  isLoading,
  emptyState,
  iterationKey,
  canLoadMore,
  error,
  additionalRowProps,
  showHeader,
  isFetching,
  customLoader,
  retry,
}) => (
  <>
    <List
      showHeader={showHeader}
      data={data}
      header={header}
      headerClassName={headerClassName}
      subHeader={subHeader}
      currentSort={currentSort}
      iterationKey={iterationKey}
      Row={row}
      error={error}
      additionalRowProps={additionalRowProps || {}}
    />
    <Empty
      data={emptyState}
      error={error}
      isLoading={isLoading}
      isListEmpty={data.length === 0}
      className={styles.emptyState}
    />
    <Error handleRetry={retry} error={error} isLoading={isLoading} />
    <LoadMoreButton
      onClick={loadData}
      isFetching={isFetching}
      dataLength={data.length}
      canLoadMore={canLoadMore}
      error={error}
    />
    {isFetching && customLoader}
    <TableLoadingState
      header={header}
      isFetching={isFetching && !customLoader}
      count={data.length === 0 ? 5 : 1}
    />
  </>
);

export default Table;
