/* istanbul ignore file */
import React, { useMemo } from 'react';
import { filterDelegates } from '../../utils';
import TableWrapper from './TableWrapper';

const DelegatesTable = ({
  setActiveTab,
  delegates,
  watchList,
  hasLoadMore,
  activeTab,
  changeSort,
  blocks,
  filters,
  sort,
}) => {
  const { delegatesFilter, canLoadMore, currentOffset } = useMemo(() => {
    const { offset: defaultOffset, count, total } = delegates?.meta || {};
    const offset = defaultOffset + count;
    return {
      delegatesFilter: filterDelegates(delegates, filters),
      canLoadMore: hasLoadMore && (offset < total),
      currentOffset: offset,
    };
  }, [delegates, filters]);

  const handleLoadMore = () => {
    delegatesFilter.loadData(
      Object.keys(filters).reduce(
        (acc, key) => ({
          ...acc,
          ...(filters[key] && { [key]: filters[key] }),
        }),
        {
          offset: currentOffset,
        },
      ),
    );
  };

  return (
    <TableWrapper
      delegates={delegatesFilter}
      blocks={blocks}
      setActiveTab={setActiveTab}
      watchList={watchList}
      handleLoadMore={handleLoadMore}
      activeTab={activeTab}
      changeSort={changeSort}
      sort={sort}
      canLoadMore={canLoadMore}
    />
  );
};

export default DelegatesTable;
