import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import BoxHeader from 'src/theme/box/header';
import Box from 'src/theme/box';
import BoxContent from 'src/theme/box/content';
import Table from 'src/theme/table';
import {
  selectCurrentBlockHeight,
  selectActiveToken,
} from 'src/redux/selectors';
import BlockchainApplicationRow from '../BlockchainApplicationRow';
import header from './BlockchainApplicationListHeaderMap';
import styles from './BlockchainApplicationList.css';

// eslint-disable-next-line max-statements
const Transactions = ({
  sort,
  changeSort,
  applications,
}) => {
  const currentBlockHeight = useSelector(selectCurrentBlockHeight);
  const activeToken = useSelector(selectActiveToken);
  const { t } = useTranslation();

  const canLoadMore = false;

  const handleLoadMore = () => {
    applications.loadData({});
  };

  return (
    <Box main isLoading={applications.isLoading} className="chain-application-box">
      <BoxHeader className={styles.boxHeader}>
        {t('Applications')}
      </BoxHeader>
      <BoxContent className={`${styles.content} chain-application-result`}>
        <Table
          data={applications.data}
          isLoading={applications.isLoading}
          row={BlockchainApplicationRow}
          loadData={handleLoadMore}
          additionalRowProps={{
            currentBlockHeight,
            activeToken,
            layout: 'full',
          }}
          header={header(changeSort, t)}
          headerClassName={styles.tableHeader}
          currentSort={sort}
          canLoadMore={canLoadMore}
          error={applications.error}
          emptyState={{
            message: t('There are no transactions for this chain.'),
          }}
        />
      </BoxContent>
    </Box>
  );
};

export default Transactions;
