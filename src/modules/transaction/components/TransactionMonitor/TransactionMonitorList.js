import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import StickyHeader from 'src/theme/table/stickyHeader';
import FilterBar from 'src/modules/common/components/filterBar';
import FilterDropdownButton from 'src/modules/common/components/filterDropdownButton';
import Box from 'src/theme/box';
import BoxContent from 'src/theme/box/content';
import Table from 'src/theme/table';
import {
  selectCurrentBlockHeight,
  selectActiveToken,
} from 'src/redux/selectors';
import TransactionSkeletonRow from '../TransactionSkeletonRow/TransactionSkeletonRow';
import TransactionRow from '../TransactionRow';
import header from './TransactionHeaderMap';
import styles from './transactionsTable.css';
import { getModuleCommandTitle } from '../../utils';

const getFields = (t) => [
  {
    label: t('Date range'),
    name: 'date',
    type: 'date-range',
  },
  {
    label: t('Amount range'),
    name: 'amount',
    type: 'number-range',
  },
  {
    label: t('Sender'),
    placeholder: t('Address or public key'),
    name: 'senderAddress',
    type: 'address',
  },
  {
    label: t('Recipient'),
    placeholder: t('Address or public key'),
    name: 'recipientAddress',
    type: 'address',
  },
  {
    label: t('Type'),
    placeholder: t('All types'),
    name: 'moduleCommandID',
    type: 'select',
  },
  {
    label: t('Height'),
    placeholder: t('e.g. {{value}}', { value: '10180477' }),
    name: 'height',
    type: 'integer',
  },
];
const blackListTypes = ['4:0', '5:0', '5:1', '5:3'];

// eslint-disable-next-line max-statements
const Transactions = ({
  t,
  sort,
  changeSort,
  filters,
  clearFilter,
  applyFilters,
  transactions,
  clearAllFilters,
}) => {
  const fields = getFields(t);
  const [innerFields, setInnerFields] = useState(fields);
  const currentBlockHeight = useSelector(selectCurrentBlockHeight);
  const activeToken = useSelector(selectActiveToken);

  const canLoadMore = transactions.meta
    ? transactions.data.length < transactions.meta.total
    : false;

  const handleLoadMore = () => {
    // filter the blanks out
    const params = Object.keys(filters).reduce(
      (acc, key) => ({
        ...acc,
        ...(filters[key] && { [key]: filters[key] }),
      }),
      {
        offset: transactions.meta.count + transactions.meta.offset,
        sort,
      },
    );

    transactions.loadData(params);
  };

  /* istanbul ignore next */
  const loadLastTransactions = () => {
    transactions.loadData();
  };

  /* istanbul ignore next */
  const formatters = {
    height: (value) => `${t('Height')}: ${value}`,
    moduleCommandID: (value) => `${t('Type')}: ${getModuleCommandTitle()[value]}`,
    senderAddress: (value) => `${t('Sender')}: ${value}`,
    recipientAddress: (value) => `${t('Recipient')}: ${value}`,
  };
  const removeSortOnAmount = (headerData, dropdownFilters) =>
    headerData.map((data) => {
      if (
        data?.sort?.key === 'amount'
        && blackListTypes.some((type) => type === dropdownFilters.moduleCommandID)
      ) delete data.sort;
      return data;
    });

  const removeField = (rawFields, transactionType) =>
    rawFields.filter((field) => {
      if (
        (field.name === 'amount' || field.name === 'recipientAddress')
        && blackListTypes.some((type) => type === transactionType)
      ) return false;

      return true;
    });

  const dropdownApplyFilters = (txFilters) => {
    const moduleCommandID = txFilters.moduleCommandID;
    applyFilters(txFilters);
    if (blackListTypes.some((type) => type === moduleCommandID)) setTimeout(() => changeSort('timestamp'), 100);
  };

  return (
    <Box main isLoading={transactions.isLoading} className="transactions-box">
      <BoxContent className={`${styles.content} transaction-results`}>
        <StickyHeader
          title={t('All transactions')}
          button={{
            className: 'load-latest',
            entity: 'transaction',
            onClick: loadLastTransactions,
            label: t('New transactions'),
          }}
          scrollToSelector=".transactions-box"
          filters={(
            <FilterDropdownButton
              fields={innerFields}
              filters={filters}
              applyFilters={dropdownApplyFilters}
              onTypeSelected={(moduleCommandID) => {
                setInnerFields(
                  moduleCommandID ? removeField(fields, moduleCommandID) : fields,
                );
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
        <Table
          showHeader
          data={transactions.data}
          isLoading={transactions.isLoading}
          row={TransactionRow}
          loadData={handleLoadMore}
          additionalRowProps={{
            currentBlockHeight,
            activeToken,
            layout: 'full',
          }}
          header={removeSortOnAmount(header(changeSort, t), filters)}
          headerClassName={styles.tableHeader}
          currentSort={sort}
          canLoadMore={canLoadMore}
          skeletonRow={TransactionSkeletonRow}
          error={transactions.error}
          emptyState={{
            message: t('There are no transactions for this chain.'),
          }}
        />
      </BoxContent>
    </Box>
  );
};

export default Transactions;
