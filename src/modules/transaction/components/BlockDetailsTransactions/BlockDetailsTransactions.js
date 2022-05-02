import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentBlockHeight, selectActiveToken } from '@common/store/selectors';
import Box from '@basics/box';
import BoxContent from '@basics/box/content';
import Table from '@basics/table';
import TransactionRow from '../TransactionRow';
import header from './BlockDetailsTransactionHeaderMap';
import styles from './BlockDetailsTransactions.css';

const Transactions = ({
  transactions,
  blockId,
  height,
  t,
}) => {
  const currentBlockHeight = useSelector(selectCurrentBlockHeight);
  const activeToken = useSelector(selectActiveToken);
  useEffect(() => {
    if (blockId || height) {
      transactions.loadData();
    }
  }, [blockId, height]);

  return (
    <Box main isLoading={transactions.isLoading} className="transactions-box">
      <BoxContent className={`${styles.content} transaction-results`}>
        <Table
          data={transactions.data}
          isLoading={transactions.isLoading}
          row={TransactionRow}
          additionalRowProps={{
            currentBlockHeight,
            layout: 'full',
            activeToken,
          }}
          header={header(t)}
          headerClassName={styles.tableHeader}
          canLoadMore={false}
          error={transactions.error}
          emptyState={{ message: t('There are no transactions for this block.') }}
        />
      </BoxContent>
    </Box>
  );
};

export default Transactions;
