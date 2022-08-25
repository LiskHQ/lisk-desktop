import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSort } from 'src/modules/common/hooks/useSort';
import Box from 'src/theme/box';
import BoxContent from 'src/theme/box/content';
import Table from 'src/theme/table';
import { usePeers } from '../../hooks/queries';
import PeerRow from '../row';
import styles from './nodeList.css';
import header from './tableHeader';

const Peers = () => {
  const { t } = useTranslation();
  const { sort, toggleSort } = useSort({ defaultSort: 'height:desc' });
  const {
    data: peers, isLoading, isFetching, error, hasNextPage, fetchNextPage,
  } = usePeers({ config: { params: { sort } } });

  return (
    <Box main isLoading={isLoading} className="peers-box">
      <BoxContent className={styles.content}>
        <Table
          showHeader
          data={peers?.data || []}
          isLoading={isFetching}
          row={PeerRow}
          loadData={fetchNextPage}
          header={header(toggleSort, t)}
          currentSort={sort}
          error={error}
          canLoadMore={hasNextPage}
        />
      </BoxContent>
    </Box>
  );
};

export default Peers;
