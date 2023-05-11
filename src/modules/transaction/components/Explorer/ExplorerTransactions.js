import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLatestBlock } from '@block/hooks/queries/useLatestBlock';
import Box from 'src/theme/box';
import BoxHeader from 'src/theme/box/header';
import BoxContent from 'src/theme/box/content';
import { QueryTable } from 'src/theme/QueryTable';
import StickyHeader from 'src/theme/table/stickyHeader';
import { useFilter, useSort } from 'src/modules/common/hooks';
import FilterBar from 'src/modules/common/components/filterBar';
import { normalizeTransactionParams } from '@transaction/utils';
import { useTokenBalances } from '@token/fungible/hooks/queries';
import TransactionRow from '../TransactionRow';
import styles from './ExplorerTransactions.css';
import header from './ExplorerTransactionsHeaderMap';
import FilterDropdown from '../FilterDropdown';
import { useMyTransactions } from '../../hooks/queries';

const Transactions = ({ activeToken, address }) => {
  const { t } = useTranslation();
  const {
    data: { height: currentBlockHeight },
  } = useLatestBlock();
  const { sort, toggleSort } = useSort({ defaultSort: 'timestamp:desc' });
  const { filters, clearFilters, applyFilters } = useFilter({});
  const { data: tokens } = useTokenBalances();
  const token = tokens?.data?.[0] || {};

  const params = normalizeTransactionParams({ ...filters, ...(sort && { sort }) }, token);

  const formatters = {
    dateFrom: (value) => `${t('From')}: ${value}`,
    dateTo: (value) => `${t('To')}: ${value}`,
    amountFrom: (value) => `> ${value}`,
    amountTo: (value) => `< ${value}`,
  };

  return (
    <Box main className={`${styles.wrapper} transactions-box`}>
      <BoxHeader>
        <StickyHeader filters={<FilterDropdown filters={filters} applyFilters={applyFilters} />} />
      </BoxHeader>
      <FilterBar
        {...{
          clearFilter: (key) => clearFilters([key]),
          clearAllFilters: () => clearFilters(),
          filters,
          formatters,
          t,
        }}
      />
      <BoxContent className={`${styles.content} transaction-results`}>
        <QueryTable
          showHeader
          button={{
            label: t('New transactions'),
          }}
          queryHook={useMyTransactions}
          queryConfig={{ config: { params: { ...params, address } } }}
          row={TransactionRow}
          additionalRowProps={{
            currentBlockHeight,
            activeToken,
            layout: 'hosted',
            isWallet: true,
            address,
          }}
          header={header(t, activeToken, toggleSort)}
          headerClassName={styles.tableHeader}
          currentSort={sort}
          emptyState={{
            message: t('There are no transactions for this account.'),
            illustration: 'emptyTransactionsIllustration'
          }}
          scrollToSelector=".transactions-box"
        />
      </BoxContent>
    </Box>
  );
};

export default Transactions;
