import React from 'react';
import { useTranslation } from 'react-i18next';
import Box from 'src/theme/box';
import BoxHeader from 'src/theme/box/header';
import BoxContent from 'src/theme/box/content';
import { useFilter } from 'src/modules/common/hooks';
import Table from 'src/theme/table';
import FilterBar from 'src/modules/common/components/filterBar';
import FilterDropdownButton from 'src/modules/common/components/filterDropdownButton';
import { useTransactionEvents } from '../../hooks/queries';
import TransactionEventRow from '../TransactionEventsRow';
import header from './TransactionEventsHeaderMap';
import styles from './TransactionEvents.css';

const getFilterFields = (t) => [
  {
    label: t('Transaction ID'),
    placeholder: t('e.g. f37305dd68de8d...'),
    name: 'transactionID',
    type: 'text',
  },
  {
    label: t('Block ID'),
    placeholder: t('e.g. cc6b795a491524...'),
    name: 'blockID',
    type: 'text',
  },
  {
    label: t('Block height'),
    placeholder: t('e.g. {{value}}', { value: '10180477' }),
    name: 'height',
    type: 'integer',
  },
];

const TransactionEvents = ({ address, isWallet, hasFilter }) => {
  const { t } = useTranslation();
  const { filters, clearFilters, applyFilters } = useFilter({
    transactionID: '',
    blockID: '',
    height: '',
  });

  const params = { ...filters, senderAddress: address };

  const {
    data: transactionEvents,
    isLoading,
    isFetching,
    error,
    hasNextPage,
    fetchNextPage,
  } = useTransactionEvents({
    config: { params },
  });

  const formatters = {
    transactionID: (value) => `${t('Transaction ID')}: ${value}`,
    blockID: (value) => `${t('Block ID')}: ${value}`,
    height: (value) => `${t('Height')}: ${value}`,
  };

  return (
    <Box main isLoading={isLoading} className={`${styles.wrapper} transaction-events-box`}>
      {hasFilter && (
        <>
          <BoxHeader>
            <FilterDropdownButton
              noDateRange
              filters={filters}
              applyFilters={applyFilters}
              fields={getFilterFields(t)}
              clearFilter={(filterKey) => clearFilters(filterKey)}
              clearAllFilters={() => clearFilters()}
            />
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
        </>
      )}
      <BoxContent className={`${styles.content}`}>
        <Table
          showHeader
          data={transactionEvents?.data || []}
          isLoading={isFetching}
          row={TransactionEventRow}
          header={header(t, isWallet)}
          headerClassName={styles.tableHeader}
          canLoadMore={hasNextPage}
          loadData={fetchNextPage}
          additionalRowProps={{
            isWallet,
          }}
          error={error}
          emptyState={{
            message: t('There are no transaction events'),
          }}
        />
      </BoxContent>
    </Box>
  );
};

export default TransactionEvents;
