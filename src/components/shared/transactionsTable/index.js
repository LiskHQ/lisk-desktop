import { withTranslation } from 'react-i18next';
import React from 'react';
import { useSelector } from 'react-redux';
import withFilters from '@utils/withFilters';
import { getModuleAssetTitle } from '@utils/moduleAssets';
import Box from '@toolbox/box';
import BoxContent from '@toolbox/box/content';
import BoxHeader from '@toolbox/box/header';
import Table from '@toolbox/table';
import { selectCurrentBlockHeight } from '@store/selectors';
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
    // filter the blanks out
    const params = Object.keys(filters).reduce((acc, key) => ({
      ...acc,
      ...(filters[key] && { [key]: filters[key] }),
    }), {
      offset: transactions.meta.count + transactions.meta.offset,
      sort,
    });

    transactions.loadData(params);
  };

  /* istanbul ignore next */
  const loadLastTransactions = () => {
    document.querySelector('.transactions-box').scrollIntoView(true);
    return transactions.loadData;
  };

  /* istanbul ignore next */
  const formatters = {
    height: value => `${t('Height')}: ${value}`,
    moduleAssetId: value => `${t('Type')}: ${getModuleAssetTitle()[value]}`,
    senderAddress: value => `${t('Sender')}: ${value}`,
    recipientAddress: value => `${t('Recipient')}: ${value}`,
  };

  return (
    <Box main isLoading={transactions.isLoading} className="transactions-box">
      <BoxHeader className={styles.header}>
        <h1>{title}</h1>
        {isLoadMoreEnabled && (
          <LoadLatestButton
            buttonClassName={`${styles.loadButton} load-latest`}
            entity="transaction"
            onClick={loadLastTransactions}
          >
            {t('New transactions')}
          </LoadLatestButton>
        )}
        <FilterDropdownButton
          fields={fields}
          filters={filters}
          applyFilters={applyFilters}
        />
      </BoxHeader>
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
          headerClassName={styles.tableHeader}
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
  recipientAddress: '',
  senderAddress: '',
};

const defaultSort = 'timestamp:desc';

export default withTranslation()(
  withFilters('transactions', defaultFilters, defaultSort)(TransactionsTable),
);
