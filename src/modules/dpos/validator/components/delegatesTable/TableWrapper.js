/* istanbul ignore file */
import React from 'react';
import { compose } from 'redux';
import withLocalSort from 'src/utils/withLocalSort';
import Table from 'src/theme/table';
import { DEFAULT_STANDBY_THRESHOLD } from '@dpos/validator/consts';
import DelegateRow from './delegateRow';
import header from './tableHeader';

const TableWrapper = compose(
  withLocalSort('delegates', 'forgingTime:asc', {
    forgingTime: (a, b, direction) =>
      (a.nextForgingTime > b.nextForgingTime ? 1 : -1)
      * (direction === 'asc' ? 1 : -1),
    status: (a, b, direction) => {
      if (a.status === 'active') {
        return 1 * (direction === 'asc' ? 1 : -1);
      }
      if (b.status === 'active' || a.status !== 'standby') {
        return -1 * (direction === 'asc' ? 1 : -1);
      }
      if (a.voteWeight < DEFAULT_STANDBY_THRESHOLD) {
        return -1 * (direction === 'asc' ? 1 : -1);
      }
      if (b.voteWeight < DEFAULT_STANDBY_THRESHOLD) {
        return 1 * (direction === 'asc' ? 1 : -1);
      }
      return 0;
    },
    sanctionedStatus: (a, b, direction) =>
      ((direction === 'asc' ? a.status > b.status : b.status > a.status)
        ? 1
        : -1),
  }),
)(
  ({
    delegates,
    handleLoadMore,
    t,
    activeTab,
    blocks,
    changeSort,
    sort,
    canLoadMore,
    watchList,
    setActiveTab,
  }) => (
    <Table
      data={delegates.data}
      error={delegates.error}
      isLoading={delegates.isLoading}
      emptyState={{
        message: t('No {{activeTab}} delegates found.', { activeTab }),
      }}
      row={DelegateRow}
      loadData={handleLoadMore}
      additionalRowProps={{
        t,
        activeTab,
        watchList,
        setActiveTab,
        blocks,
      }}
      header={header(activeTab, changeSort, t)}
      currentSort={sort}
      canLoadMore={canLoadMore}
    />
  ),
);

export default TableWrapper;
