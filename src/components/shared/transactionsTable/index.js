import { withTranslation } from 'react-i18next';
import React from 'react';
import Box from '../../toolbox/box';
import BoxContent from '../../toolbox/box/content';
import BoxHeader from '../../toolbox/box/header';
import FilterBar from '../filterBar';
import transactionTypes from '../../../constants/transactionTypes';
import FilterDropdownButton from '../filterDropdownButton';
import LoadLatestButton from '../loadLatestButton';
import Table from '../../toolbox/table';
import styles from './transactionsTable.css';
import withFilters from '../../../utils/withFilters';
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
  const handleLoadMore = () => {
    const params = Object.keys(filters).reduce((acc, key) => ({
      ...acc,
      ...(filters[key] && { [key]: key === 'type' ? transactionTypes.getByCode(Number(filters[key])).outgoingCode : filters[key] }),
    }), {
      offset: transactions.data.length,
      sort,
    });
    transactions.loadData(params);
  };

  /* istanbul ignore next */
  const formatters = {
    height: value => `${t('Height')}: ${value}`,
    type: value => `${t('Type')}: ${transactionTypes.getByCode(Number(value)).title}`,
    sender: value => `${t('Sender')}: ${value}`,
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
        )
      }
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
          additionalRowProps={{ t }}
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
  type: '',
  height: '',
  recipient: '',
  sender: '',
};

const defaultSort = 'timestamp:desc';

export default withTranslation()(
  withFilters('transactions', defaultFilters, defaultSort)(TransactionsTable),
);
