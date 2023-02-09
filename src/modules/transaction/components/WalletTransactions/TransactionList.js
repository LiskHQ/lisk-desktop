import React, { useEffect } from 'react';
import { useLatestBlock } from '@block/hooks/queries/useLatestBlock';
import Box from 'src/theme/box';
import BoxHeader from 'src/theme/box/header';
import BoxContent from 'src/theme/box/content';
import Table from 'src/theme/table';
import FilterBar from 'src/modules/common/components/filterBar';
import TransactionRow from '../TransactionRow';
import FilterDropdown from '../FilterDropdown';
import styles from './TransactionList.css';
import header from './TransactionHeader';

const Transactions = ({
  pending,
  transactions,
  activeToken,
  filters,
  applyFilters,
  changeSort,
  sort,
  clearFilter,
  clearAllFilters,
  t,
  stakedValidators,
  address,
  confirmedLength,
}) => {
  const { data: { height: currentBlockHeight } }= useLatestBlock();
  useEffect(() => {
    // This will automatically load the new data too.
    clearAllFilters();
  }, [activeToken]);

  useEffect(() => {
    const addressList =
      transactions.data.data &&
      transactions.data.data.reduce((acc, data) => {
        if (data.title === 'stake') {
          const stakesList = data.params.stakes || [];
          const dataAddresses = stakesList.map((stake) => stake.validatorAddress);
          return acc.concat(dataAddresses);
        }
        return acc;
      }, []);
    if (addressList.length > 0) {
      stakedValidators.loadData({ addressList });
    }
  }, [transactions.data.data]);

  useEffect(() => {
    transactions.loadData();
  }, [pending.length, confirmedLength, address]);

  /* istanbul ignore next */
  const handleLoadMore = () => {
    transactions.loadData({
      offset: transactions.data.meta.count + transactions.data.meta.offset,
      sort,
      ...filters,
    });
  };

  const canLoadMore = transactions.data.meta
    ? transactions.data.meta.total > transactions.data.meta.count + transactions.data.meta.offset
    : false;

  const formatters = {
    dateFrom: (value) => `${t('From')}: ${value}`,
    dateTo: (value) => `${t('To')}: ${value}`,
    amountFrom: (value) => `> ${value} ${activeToken}`,
    amountTo: (value) => `< ${value} ${activeToken}`,
  };

  return (
    <Box main isLoading={transactions.isLoading} className={`${styles.wrapper} transactions-box`}>
      <BoxHeader>
        {activeToken === 'LSK' ? (
          <FilterDropdown filters={filters} applyFilters={(f) => applyFilters({ ...f, address })} />
        ) : null}
      </BoxHeader>
      <FilterBar
        {...{
          clearFilter,
          clearAllFilters,
          filters,
          formatters,
          t,
        }}
      />
      <BoxContent className={`${styles.content} transaction-results`}>
        <Table
          showHeader
          data={pending.concat(transactions.data.data)}
          isLoading={transactions.isLoading}
          row={TransactionRow}
          loadData={handleLoadMore}
          additionalRowProps={{
            activeToken,
            host: address,
            validators: stakedValidators.data,
            currentBlockHeight,
            layout: 'hosted',
            avatarSize: 40,
          }}
          header={header(t, changeSort)}
          currentSort={sort}
          canLoadMore={canLoadMore}
          error={transactions.error.code !== 404 ? transactions.error : undefined}
          emptyState={{
            message: t('This account does not have any transactions.'),
          }}
        />
      </BoxContent>
    </Box>
  );
};

export default Transactions;
