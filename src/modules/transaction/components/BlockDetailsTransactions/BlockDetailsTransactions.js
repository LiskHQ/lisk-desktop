import React from 'react';
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
  const {
    data: transactions, isLoading, isFetching, error,
  } = useTransactions({
    config: {
      params: {
        ...blockId && { blockID: blockId },
        ...height && { height },
      },
    },
  });

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
            className: styles.row,
            avatarSize: 40,
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
