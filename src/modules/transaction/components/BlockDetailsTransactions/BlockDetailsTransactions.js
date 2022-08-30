import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  selectCurrentBlockHeight,
  selectActiveToken,
} from 'src/redux/selectors';
import Box from 'src/theme/box';
import BoxContent from 'src/theme/box/content';
import Table from 'src/theme/table';
import { useTransactions } from '../../hooks/queries';
import TransactionRow from '../TransactionRow';
import header from './BlockDetailsTransactionHeaderMap';
import styles from './BlockDetailsTransactions.css';

const BlockDetailsTransactions = ({
  blockId,
  height,
  t,
}) => {
  const currentBlockHeight = useSelector(selectCurrentBlockHeight);
  const activeToken = useSelector(selectActiveToken);
  const [config, setConfig] = useState({ params: {} });
  const {
    data: transactions, isLoading, isFetching, error,
  } = useTransactions({ config });
  useEffect(() => {
    // Ensure query supports both ID and height
    if (blockId && !height) {
      setConfig({ params: { blockID: blockId } });
    }
    if (!blockId && height) {
      setConfig({ params: { height } });
    }
    if (blockId && height) {
      setConfig({ params: { blockID: blockId, height } });
    }
  }, [blockId, height]);

  return (
    <Box main isLoading={isLoading} className="transactions-box">
      <BoxContent className={`${styles.content} transaction-results`}>
        <Table
          showHeader
          data={transactions?.data || []}
          isLoading={isFetching}
          row={TransactionRow}
          additionalRowProps={{
            currentBlockHeight,
            layout: 'full',
            activeToken,
          }}
          header={header(t)}
          headerClassName={styles.tableHeader}
          canLoadMore={false}
          error={error}
          emptyState={{
            message: t('There are no transactions for this block.'),
          }}
        />
      </BoxContent>
    </Box>
  );
};

export default BlockDetailsTransactions;
