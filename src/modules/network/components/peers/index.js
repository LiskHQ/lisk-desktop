import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSort } from 'src/modules/common/hooks';
import Box from 'src/theme/box';
import BoxContent from 'src/theme/box/content';
import Table from 'src/theme/table';
import { usePeers } from '../../hooks/queries';
import PeerRow from '../row';
import styles from './nodeList.css';
import header from './tableHeader';

const Peers = () => {
  const { t } = useTranslation();
  const { data, isLoading, error, hasNextPage, fetchNextPage } = usePeers();

  const {
    sort,
    toggleSort,
    sortedData: peers,
  } = useSort({ data: data?.data, defaultSort: 'height:desc' });

  return (
    <Box main isLoading={isLoading} className="peers-box">
      <BoxContent className={styles.content}>
        <Table
          showHeader
          data={peers}
          row={PeerRow}
          loadData={fetchNextPage}
          header={header(toggleSort, t)}
          currentSort={sort}
          error={error}
          canLoadMore={hasNextPage}
          emptyState={{
            message: t('No connected peers found.'),
          }}
        />
      </BoxContent>
    </Box>
  );
};

export default Peers;
