/* istanbul ignore file */
import React from 'react';
import TableWrapper from './TableWrapper';
import { selectDelegates, shouldAllowLoadMore } from '../../utils';

const DelegatesTable = ({
  setActiveTab,
  delegates,
  watchList,
  watchedDelegates,
  standByDelegates,
  sanctionedDelegates,
  activeTab,
  changeSort,
  blocks,
  filters,
  sort,
  t,
}) => {
  const delegatesToShow = selectDelegates({
    activeTab,
    delegates,
    standByDelegates,
    sanctionedDelegates,
    watchedDelegates,
    filters,
    watchList,
  });

  const canLoadMore = shouldAllowLoadMore(
    activeTab,
    standByDelegates,
    sanctionedDelegates,
  );

  const handleLoadMore = () => {
    delegatesToShow.loadData(
      Object.keys(filters).reduce(
        (acc, key) => ({
          ...acc,
          ...(filters[key] && { [key]: filters[key] }),
        }),
        {
          offset: delegatesToShow.meta.count + delegatesToShow.meta.offset,
        },
      ),
    );
  };

  return (
    <TableWrapper
      delegates={delegatesToShow}
      blocks={blocks}
      setActiveTab={setActiveTab}
      watchList={watchList}
      handleLoadMore={handleLoadMore}
      t={t}
      activeTab={activeTab}
      changeSort={changeSort}
      sort={sort}
      canLoadMore={canLoadMore}
    />
  );
};

export default DelegatesTable;
