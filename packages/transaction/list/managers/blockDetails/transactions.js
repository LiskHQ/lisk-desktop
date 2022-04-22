import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentBlockHeight } from '@common/store/selectors';
import Box from '@basics/box';
import BoxContent from '@basics/box/content';
import Table from '@basics/table';
import TransactionRow from '@transaction/list/row';
import header from './tableHeader';
import styles from './blockDetails.css';

const Transactions = ({
  transactions,
  blockId,
  height,
  t,
}) => {
  const currentBlockHeight = useSelector(selectCurrentBlockHeight);
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
            t,
            currentBlockHeight,
            layout: 'full',
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
