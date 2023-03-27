import React from 'react';
import { useSelector } from 'react-redux';
import { selectActiveToken } from 'src/redux/selectors';
import { useLatestBlock } from '@block/hooks/queries/useLatestBlock';
import Box from 'src/theme/box';
import BoxContent from 'src/theme/box/content';
import { useTranslation } from 'react-i18next';
import Table from 'src/theme/table';
import { useTransactions } from '../../hooks/queries';
import TransactionRow from '../TransactionRow';
import header from './BlockDetailsTransactionHeaderMap';
import styles from './BlockDetailsTransactions.css';

const BlockDetailsTransactions = ({ blockId, height }) => {
  const { t } = useTranslation();
  const {
    data: { height: currentBlockHeight },
  } = useLatestBlock();
  const activeToken = useSelector(selectActiveToken);
  const {
    data: transactions,
    isLoading,
    isFetching,
    error,
  } = useTransactions({
    config: {
      params: {
        ...(blockId && { blockID: blockId }),
        ...(height && { height }),
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
          emptyState={
            !error
              ? {
                  message: t('There are no transactions for this block.'),
                }
              : undefined
          }
        />
      </BoxContent>
    </Box>
  );
};

export default BlockDetailsTransactions;
