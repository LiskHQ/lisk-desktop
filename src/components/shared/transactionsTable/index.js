import { withTranslation } from 'react-i18next';
import React from 'react';
import { useSelector } from 'react-redux';
import { MODULE_ASSETS_NAME_ID_MAP } from '@constants';
import withFilters from '@utils/withFilters';
import { getModuleAssetTitle } from '@utils/moduleAssets';
import Box from '@toolbox/box';
import BoxContent from '@toolbox/box/content';
import BoxHeader from '@toolbox/box/header';
import Table from '@toolbox/table';
import { selectCurrentBlockHeight } from '@store';
import FilterBar from '../filterBar';
import FilterDropdownButton from '../filterDropdownButton';
import LoadLatestButton from '../loadLatestButton';
import styles from './transactionsTable.css';
import TransactionRow from './transactionRow';
import header from './tableHeader';

const TransactionsTable = ({
  title,
  transactions,
  isLoadMoreEnabled,
  t,
  fields,
  filters,
  applyFilters,
  clearFilter,
  clearAllFilters,
  changeSort,
  sort,
  canLoadMore,
  emptyState,
}) => {
  const currentBlockHeight = useSelector(selectCurrentBlockHeight);
  const handleLoadMore = () => {
    const params = Object.keys(filters).reduce((acc, key) => ({
      ...acc,
      ...(filters[key] && { [key]: key === 'moduleAssetId' ? MODULE_ASSETS_NAME_ID_MAP[filters[key]] : filters[key] }),
    }), {
      offset: transactions.meta.count + transactions.meta.offset,
      sort,
    });
    transactions.loadData(params);
  };

  /* istanbul ignore next */
  const formatters = {
    height: value => `${t('Height')}: ${value}`,
    moduleAssetId: value => `${t('Type')}: ${getModuleAssetTitle()[value]}`,
    address: value => `${t('Address')}: ${value}`,
    recipient: value => `${t('Recipient')}: ${value}`,
  };

  return (
    <Box main isLoading={transactions.isLoading} className="transactions-box">
      <BoxHeader>
        <h1>{title}</h1>
        <FilterDropdownButton
          fields={fields}
          filters={filters}
          applyFilters={applyFilters}
        />
      </BoxHeader>
      {isLoadMoreEnabled
        && (
        <LoadLatestButton
          event="update.transactions.confirmed"
          onClick={transactions.loadData}
        >
          {t('New transactions')}
        </LoadLatestButton>
        )}
      <FilterBar {...{
        clearFilter, clearAllFilters, filters, formatters, t,
      }}
      />
      <BoxContent className={styles.content}>
        <Table
          data={transactions.data}
          isLoading={transactions.isLoading}
          row={TransactionRow}
          loadData={handleLoadMore}
          additionalRowProps={{ t, currentBlockHeight }}
          header={header(changeSort, t)}
          currentSort={sort}
          canLoadMore={canLoadMore}
          error={transactions.error}
          emptyState={emptyState}
        />
      </BoxContent>
    </Box>
  );
};

TransactionsTable.defaultProps = {
  isLoadMoreEnabled: false,
  filters: {},
  fields: [],
};

const defaultFilters = {
  dateFrom: '',
  dateTo: '',
  message: '',
  amountFrom: '',
  amountTo: '',
  moduleAssetId: '',
  height: '',
  recipient: '',
  address: '',
};

const defaultSort = 'timestamp:desc';

export default withTranslation()(
  withFilters('transactions', defaultFilters, defaultSort)(TransactionsTable),
);
