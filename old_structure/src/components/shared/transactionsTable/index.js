import { withTranslation } from 'react-i18next';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import withFilters from '@utils/withFilters';
import { getModuleAssetTitle } from '@utils/moduleAssets';
import Box from '@toolbox/box';
import BoxContent from '@toolbox/box/content';
import Table from '@toolbox/table';
import { selectCurrentBlockHeight } from '@store/selectors';
import StickyHeader from '@shared/stickyHeader';
import FilterBar from '../filterBar';
import FilterDropdownButton from '../filterDropdownButton';
import styles from './transactionsTable.css';
import TransactionRow from './transactionRow';
import header from './tableHeader';

const blackListTypes = ['4:0', '5:0', '5:1', '5:3'];
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
  const [innerFields, setInnerFields] = useState(fields);

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
  const loadLastTransactions = () => { transactions.loadData(); };

  /* istanbul ignore next */
  const formatters = {
    height: value => `${t('Height')}: ${value}`,
    moduleAssetId: value => `${t('Type')}: ${getModuleAssetTitle()[value]}`,
    senderAddress: value => `${t('Sender')}: ${value}`,
    recipientAddress: value => `${t('Recipient')}: ${value}`,
  };

  const removeSortOnAmount = (headerData, dropdownFilters) => headerData.map(data => {
    if (data?.sort?.key === 'amount' && blackListTypes.some((type) => type === dropdownFilters.moduleAssetId)) delete data.sort;
    return data;
  });

  const removeField = (rawFields, transactionType) => rawFields.filter((field) => {
    if ((field.name === 'amount' || field.name === 'recipientAddress')
        && blackListTypes.some((type) => type === transactionType)
    ) return false;

    return true;
  });

  const dropdownApplyFilters = (tranxFilters) => {
    const moduleAssetId = tranxFilters.moduleAssetId;
    applyFilters(tranxFilters);
    if (blackListTypes.some((type) => type === moduleAssetId)) setTimeout(() => changeSort('timestamp'), 100);
  };

  return (
    <Box main isLoading={transactions.isLoading} className="transactions-box">
      <StickyHeader
        title={title}
        button={isLoadMoreEnabled ? {
          className: 'load-latest',
          entity: 'transaction',
          onClick: loadLastTransactions,
          label: t('New transactions'),
        } : undefined}
        scrollToSelector=".transactions-box"
        filters={(
          <FilterDropdownButton
            fields={innerFields}
            filters={filters}
            applyFilters={dropdownApplyFilters}
            onTypeSelected={moduleAssetId => {
              setInnerFields(moduleAssetId ? removeField(fields, moduleAssetId) : fields);
            }}
          />
        )}
      />
      <FilterBar
        {...{ filters, formatters, t }}
        clearFilter={(filterKey) => {
          setInnerFields(fields);
          clearFilter(filterKey);
        }}
        clearAllFilters={() => {
          setInnerFields(fields);
          clearAllFilters();
        }}
      />
      <BoxContent className={`${styles.content} transaction-results`}>
        <Table
          data={transactions.data}
          isLoading={transactions.isLoading}
          row={TransactionRow}
          loadData={handleLoadMore}
          additionalRowProps={{ t, currentBlockHeight }}
          header={removeSortOnAmount(header(changeSort, t), filters)}
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
