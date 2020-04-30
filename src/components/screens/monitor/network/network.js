import React from 'react';
import Box from '../../../toolbox/box';
import BoxHeader from '../../../toolbox/box/header';
import BoxContent from '../../../toolbox/box/content';
import Table from '../../../toolbox/table';
import styles from './network.css';
import header from './tableHeader';
import MonitorHeader from '../header';
import Map from './map';
import PeerRow from './peerRow';
import Overview from './overview';

const Network = ({
  peers, t, changeSort, sort, networkStatistics,
}) => {
  /* istanbul ignore next */
  const handleLoadMore = () => {
    peers.loadData({ offset: peers.data.length });
  };
  const canLoadMore = peers.meta ? peers.data.length < peers.meta.total : false;
  return (
    <div>
      <MonitorHeader />
      <Overview networkStatus={networkStatistics.data} t={t} />
      <Box main isLoading={peers.isLoading} className="peers-box">
        <BoxHeader>
          <h1 className="contentHeader">{t('Connected peers')}</h1>
        </BoxHeader>
        <BoxContent className={styles.content}>
          <Map peers={peers.data} />
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
    </div>
  );
};

export default Network;
