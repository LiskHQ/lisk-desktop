import React from 'react';
import Box from '@theme/box';
import BoxContent from '@basics/box/content';
import Table from '@basics/table';
import PeerRow from '../row';
import styles from './nodeList.css';
import header from './tableHeader';

const Peers = ({ peers, t, changeSort, sort }) => {
  /* istanbul ignore next */
  const handleLoadMore = () => {
    peers.loadData({ offset: peers.data.length });
  };
  const canLoadMore = peers.meta ? peers.data.length < peers.meta.total : false;

  return (
    <Box main isLoading={peers.isLoading} className="peers-box">
      <BoxContent className={styles.content}>
        <Table
          data={peers.data}
          isLoading={peers.isLoading}
          row={PeerRow}
          loadData={handleLoadMore}
          header={header(changeSort, t)}
          currentSort={sort}
          error={peers.error}
          canLoadMore={canLoadMore}
        />
      </BoxContent>
    </Box>
  );
};

export default Peers;
