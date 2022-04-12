import React from 'react';
import Box from '@basics/box';
import BoxContent from '@basics/box/content';
import Table from '@basics/table';
import styles from '../../network.css';
import header from './tableHeader';
import Map from '../../map';
import PeerRow from '../row';

export const NodeList = ({
    peers, t, changeSort, sort,
  }) => {
    /* istanbul ignore next */
    const handleLoadMore = () => {
      peers.loadData({ offset: peers.data.length });
    };
    const canLoadMore = peers.meta ? peers.data.length < peers.meta.total : false;
  
    return (
      <>
        <Box className="map-box">
          <BoxContent className={styles.mapWrapper}>
            <Map peers={peers.data} />
          </BoxContent>
        </Box>
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
      </>
    );
  };

  export default NodeList;