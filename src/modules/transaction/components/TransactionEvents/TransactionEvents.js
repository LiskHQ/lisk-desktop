import React from 'react';
import { useTranslation } from 'react-i18next';
import Box from 'src/theme/box';
import BoxContent from 'src/theme/box/content';
import Table from 'src/theme/table';
import { useTransactionEvents } from '../../hooks/queries';
import TransactionEventRow from '../TransactionEventsRow';
import header from './TransactionEventsHeaderMap';
import styles from './TransactionEvents.css';

const TransactionEvents = ({ blockId }) => {
  const { t } = useTranslation();
  const {
    data: transactionEvents,
    isLoading,
    isFetching,
    error,
    hasNextPage,
    fetchNextPage,
  } = useTransactionEvents({ config: { params: { blockID: blockId } } });

  return (
    <Box main isLoading={isLoading} className="transaction-events-box">
      <BoxContent className={`${styles.content}`}>
        <Table
          showHeader
          data={transactionEvents?.data || []}
          isLoading={isFetching}
          row={TransactionEventRow}
          header={header(t)}
          headerClassName={styles.tableHeader}
          canLoadMore={hasNextPage}
          loadData={fetchNextPage}
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
