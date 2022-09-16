import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import StickyHeader from '@theme/table/stickyHeader';
import { QueryTable } from '@theme/QueryTable';
import { useSort } from 'src/modules/common/hooks';
import useFilter from 'src/modules/common/hooks/useFilter';
import FilterBar from 'src/modules/common/components/filterBar';
import FilterDropdownButton from 'src/modules/common/components/filterDropdownButton';
import Box from 'src/theme/box';
import BoxContent from 'src/theme/box/content';
import { selectCurrentBlockHeight, selectActiveToken } from 'src/redux/selectors';
import { useTransactions } from '../../hooks/queries';
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
    name: 'moduleCommand',
    type: 'select',
  },
  {
    label: t('Height'),
    placeholder: t('e.g. {{value}}', { value: '10180477' }),
    name: 'height',
    type: 'integer',
  },
];
const blackListTypes = [
  'auth:registerMultisignatureGroup',
  'dpos:registerDelegate',
  'dpos:voteDelegate',
  'dpos:reportDelegateMisbehavior',
];

// eslint-disable-next-line max-statements
const Transactions = ({
  t,
  // sort,
  // changeSort,
  // filters,
  // clearFilter,
  // applyFilters,
  // transactions,
  // clearAllFilters,
}) => {
  const fields = getFields(t);
  const [innerFields, setInnerFields] = useState(fields);
  const [params, setParams] = useState();
  const currentBlockHeight = useSelector(selectCurrentBlockHeight);
  const activeToken = useSelector(selectActiveToken);
  const { sort, toggleSort } = useSort();
  const { filters, applyFilters, clearFilters } = useFilter({});

  // const canLoadMore = transactions.meta
  //   ? transactions.data.length < transactions.meta.total
  //   : false;

  // const handleLoadMore = () => {
  //   // filter the blanks out
  //   const params = Object.keys(filters).reduce(
  //     (acc, key) => ({
  //       ...acc,
  //       ...(filters[key] && { [key]: filters[key] }),
  //     }),
  //     {
  //       offset: transactions.meta.count + transactions.meta.offset,
  //       sort,
  //     }
  //   );

  //   transactions.loadData(params);
  // };

  /* istanbul ignore next */
  // const loadLastTransactions = () => {
  //   transactions.loadData();
  // };

  /* istanbul ignore next */
  const formatters = {
    height: (value) => `${t('Height')}: ${value}`,
    moduleCommand: (value) => `${t('Type')}: ${getModuleCommandTitle()[value]}`,
    senderAddress: (value) => `${t('Sender')}: ${value}`,
    recipientAddress: (value) => `${t('Recipient')}: ${value}`,
  };
  const removeSortOnAmount = (headerData, dropdownFilters) =>
    headerData.map((data) => {
      if (
        data?.sort?.key === 'amount' &&
        blackListTypes.some((type) => type === dropdownFilters.moduleCommand)
      )
        delete data.sort;
      return data;
    });

  const removeField = (rawFields, transactionType) =>
    rawFields.filter((field) => {
      if (
        (field.name === 'amount' || field.name === 'recipientAddress') &&
        blackListTypes.some((type) => type === transactionType)
      )
        return false;

      return true;
    });

  const dropdownApplyFilters = (txFilters) => {
    const moduleCommand = txFilters.moduleCommand;
    applyFilters(txFilters);
    if (blackListTypes.some((type) => type === moduleCommand))
      setTimeout(() => toggleSort('timestamp'), 100);
  };

  const clearAllTxnFilters = () => {
    const clearFilterData = () => setParams({});
    clearFilters(clearFilterData);
  };

  return (
    <Box main className="transactions-box">
      <BoxContent className={`${styles.content} transaction-results`}>
        <StickyHeader
          title={t('All transactions')}
          filters={
            <FilterDropdownButton
              fields={innerFields}
              filters={filters}
              applyFilters={dropdownApplyFilters}
              onTypeSelected={(moduleCommand) => {
                setInnerFields(moduleCommand ? removeField(fields, moduleCommand) : fields);
              }}
            />
          }
        />
        <FilterBar
          {...{ filters, formatters, t }}
          clearFilter={(filterKey) => {
            setInnerFields(fields);
            clearFilters(filterKey);
          }}
          clearAllFilters={() => {
            setInnerFields(fields);
            clearAllTxnFilters();
          }}
        />
        <QueryTable
          showHeader
          button={{
            className: 'load-latest',
            // entity: 'transaction',
            // onClick: loadLastTransactions,
            label: t('New transactions'),
          }}
          // data={transactions.data}
          queryHook={useTransactions}
          queryConfig={{ config: { params } }}
          row={TransactionRow}
          // loadData={handleLoadMore}
          additionalRowProps={{
            currentBlockHeight,
            activeToken,
            layout: 'full',
          }}
          header={removeSortOnAmount(header(toggleSort, t), filters)}
          headerClassName={styles.tableHeader}
          currentSort={sort}
          // canLoadMore={canLoadMore}
          // error={transactions.error}
          emptyState={{
            message: t('There are no transactions for this chain.'),
          }}
          scrollToSelector=".transactions-box"
        />
      </BoxContent>
    </Box>
  );
};

export default Transactions;
