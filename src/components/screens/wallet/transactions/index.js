import React, { useEffect } from 'react';
import Box from '../../../toolbox/box';
import BoxHeader from '../../../toolbox/box/header';
import BoxContent from '../../../toolbox/box/content';
import Table from '../../../toolbox/table';
import styles from './transactions.css';
import header from './tableHeader';
import FilterBar from '../../../shared/filterBar';
import withFilters from '../../../../utils/withFilters';
import TransactionRow from './transactionRow';
import FilterDropdown from './filterDropdown';

const Transactions = ({
  pending,
  transactions,
  activeToken,
  filters,
  applyFilters,
  clearFilter,
  clearAllFilters,
  host,
  t,
}) => {
  /* istanbul ignore next */
  const handleLoadMore = () => {
    transactions.loadData({ offset: transactions.data.length });
  };

  const canLoadMore = transactions.meta
    ? transactions.meta.count > transactions.data.length
    : false;

  const formatters = {
    dateFrom: value => `${t('From')}: ${value}`,
    dateTo: value => `${t('To')}: ${value}`,
    amountFrom: value => `> ${value} ${activeToken}`,
    amountTo: value => `< ${value} ${activeToken}`,
    message: value => `${t('Message')}: ${value}`,
  };

  useEffect(() => {
    // This will automatically load the new data too.
    clearAllFilters();
  }, [activeToken]);

  useEffect(() => {
    console.log('>>>', filters);
    console.log('>>>', transactions);
  }, [filters]);

  return (
    <Box main isLoading={transactions.isLoading} className={`${styles.wrapper} transactions-box`}>
      <BoxHeader>
        {
          activeToken === 'LSK' ? (
            <FilterDropdown filters={filters} applyFilters={applyFilters} />
          ) : null
        }
      </BoxHeader>
      <FilterBar {...{
        clearFilter, clearAllFilters, filters, formatters, t,
      }}
      />
      <BoxContent className={`${styles.content} transaction-results`}>
        <Table
          data={pending.concat(transactions.data)}
          isLoading={transactions.isLoading}
          row={TransactionRow}
          loadData={handleLoadMore}
          header={header(t, activeToken)}
          error={transactions.error}
          canLoadMore={canLoadMore}
          additionalRowProps={{ t, activeToken, host }}
        />
      </BoxContent>
    </Box>
  );
};

const defaultFilters = {
  dateFrom: '',
  dateTo: '',
  amountFrom: '',
  amountTo: '',
  message: '',
};
const defaultSort = 'timestamp:desc';

export default withFilters('transactions', defaultFilters, defaultSort)(Transactions);
