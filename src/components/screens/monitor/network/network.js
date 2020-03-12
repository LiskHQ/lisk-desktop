import React from 'react';
import Box from '../../../toolbox/box';
import BoxHeader from '../../../toolbox/box/header';
import BoxContent from '../../../toolbox/box/content';
import Table from '../../../toolbox/table';
import styles from './network.css';
import header from './tableHeader';
import MonitorHeader from '../header';
import PeerRow from './peerRow';

const Network = ({ peers, t }) => {
  const handleLoadMore = () => {
    peers.loadData({ offset: peers.data.length });
  };
  const canLoadMore = peers.meta ? peers.data.length < peers.meta.total : false;

  return (
    <div>
      <MonitorHeader />
      <Box main isLoading={peers.isLoading} className="peers-box">
        <BoxHeader>
          <h1>{t('Connected peers')}</h1>
        </BoxHeader>
        <BoxContent className={styles.content}>
          <Table
            data={peers.data}
            isLoading={peers.isLoading}
            row={PeerRow}
            loadData={handleLoadMore}
            header={header(() => null, t)}
            error={peers.error}
            canLoadMore={canLoadMore}
          />
        </BoxContent>
      </Box>
    </div>
  );
};

export default Network;
