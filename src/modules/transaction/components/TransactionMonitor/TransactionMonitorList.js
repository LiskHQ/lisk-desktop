import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import StickyHeader from '@theme/table/stickyHeader';
import { QueryTable } from '@theme/QueryTable';
import { useSort } from 'src/modules/common/hooks';
import useFilter from 'src/modules/common/hooks/useFilter';
import FilterBar from 'src/modules/common/components/filterBar';
import FilterDropdownButton from 'src/modules/common/components/filterDropdownButton';
import Box from 'src/theme/box';
import BoxContent from 'src/theme/box/content';
import { selectActiveToken } from 'src/redux/selectors';
import { useLatestBlock } from '@block/hooks/queries/useLatestBlock';
import { useTransactions } from '../../hooks/queries';
import TransactionRow from '../TransactionRow';
import header from './TransactionHeaderMap';
import styles from './transactionsTable.css';
import { getModuleCommandTitle, normalizeTransactionParams } from '../../utils';

const getFields = (t) => [
  {
    label: t('Date range'),
    name: 'date',
    type: 'date-range',
  },
  {
    label: t('Sender'),
    placeholder: t('Address or public key'),
    name: 'senderAddress',
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
  'auth:registerMultisignature',
  'dpos:registerDelegate',
  'dpos:voteDelegate',
  'dpos:reportDelegateMisbehavior',
];

// eslint-disable-next-line max-statements
const Transactions = () => {
  const { t } = useTranslation();
  const fields = getFields(t);
  const [innerFields, setInnerFields] = useState(fields);
  const [params, setParams] = useState();
  const { data: { height: currentBlockHeight } } = useLatestBlock();
  const activeToken = useSelector(selectActiveToken);
  const { sort, toggleSort } = useSort();
  const { filters, applyFilters, clearFilters } = useFilter({});

  useEffect(() => {
    setParams(normalizeTransactionParams({ ...filters, ...(sort && { sort }) }));
  }, [filters, sort]);

  /* istanbul ignore next */
  const formatters = {
    height: (value) => `${t('Height')}: ${value}`,
    moduleCommand: (value) => `${t('Type')}: ${getModuleCommandTitle()[value]}`,
    senderAddress: (value) => `${t('Sender')}: ${value}`,
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
        (field.name === 'amount') &&
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

  const clearTxnFilter = (filterKey) => {
    clearFilters([filterKey]);
  };

  const clearAllTxnFilters = () => {
    clearFilters();
  };

  return (
    <Box main className="transactions-box">
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
      <BoxContent className={`${styles.content} transaction-results`}>
        <FilterBar
          {...{ filters, formatters, t }}
          clearFilter={(filterKey) => {
            setInnerFields(fields);
            clearTxnFilter(filterKey);
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
            label: t('New transactions'),
          }}
          queryHook={useTransactions}
          queryConfig={{ config: { params } }}
          row={TransactionRow}
          additionalRowProps={{
            currentBlockHeight,
            activeToken,
            layout: 'full',
          }}
          header={removeSortOnAmount(header(toggleSort, t), filters)}
          headerClassName={styles.tableHeader}
          currentSort={sort}
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
