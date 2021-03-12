import React from 'react';
import { compose } from 'redux';
import { withTranslation } from 'react-i18next';
import Box from '../../../toolbox/box';
import BoxHeader from '../../../toolbox/box/header';
import BoxContent from '../../../toolbox/box/content';
import Tooltip from '../../../toolbox/tooltip/tooltip';
import Table from '../../../toolbox/table';
import styles from './network.css';
import header from './tableHeader';
import Map from './map';
import PeerRow from './peerRow';
import Overview from './overview';
import withLocalSort from 'utils/withLocalSort';
import { getNetworkStatistics, getConnectedPeers } from 'utils/api/network';
import withData from 'utils/withData';
import { tokenMap } from 'constants';

/**
 * Compares two version values to and returns
 * a numeric comparison index
 *
 * @param {String} direction
 * Can either be desc or asc. By Default desc
 * @param {Object} a
 * The first peer values whose version we want tot compare
 * Should have a version member equal to x.x.x[-name.x]
 * @param {Object} b
 * Should have a version member equal to x.x.x[-name.x]
 * The second peer values whose version we want tot compare
 * @returns {Number}
 * 1 for a > b
 * 0 for a == b
 * -1 for a < b
 */
export const sortByVersion = (a, b, direction = 'desc') => {
  if (a.version === b.version) return 0;

  const split = (version) => {
    const arr = version.split(/\.|-/);
    return Array.from(
      { length: 5 },
      (item, index) => {
        if (arr[index] === 'rc') return -1;
        if (arr[index] === 'beta') return -2;
        return parseInt(arr[index], 10) || 0;
      },
    );
  };
  const aParts = split(a.version);
  const bParts = split(b.version);

  return aParts.reduce((acc, item, index) => {
    if (acc === 0 && item > bParts[index]) acc = 1;
    if (acc === 0 && item < bParts[index]) acc = -1;
    return acc;
  }, 0) * (direction === 'desc' ? -1 : 1);
};

export const NetworkPure = ({
  peers, t, changeSort, sort, networkStatistics,
}) => {
  /* istanbul ignore next */
  const handleLoadMore = () => {
    peers.loadData({ offset: peers.data.length });
  };
  const canLoadMore = peers.meta ? peers.data.length < peers.meta.total : false;

  return (
    <div>
      <Overview networkStatus={networkStatistics.data} t={t} />
      <Box className="map-box">
        <BoxHeader>
          <div>
            <h1 className={`${styles.contentHeader} contentHeader`}>
              {t('Connected peers')}
            </h1>
            <Tooltip position="right">
              <p>{t('The current list only reflects the peers connected to the Lisk Service node.')}</p>
            </Tooltip>
          </div>
        </BoxHeader>
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
    </div>
  );
};

export default compose(
  withData({
    networkStatistics: {
      apiUtil: network => getNetworkStatistics({ network }, tokenMap.LSK.key),
      defaultData: {},
      autoload: true,
      transformResponse: response => response.data,
    },
    peers: {
      apiUtil: (network, params) => getConnectedPeers({ network, params }, tokenMap.LSK.key),
      defaultData: [],
      autoload: true,
      transformResponse: response => response.data,
    },
  }),
  withLocalSort('peers', 'height:desc', { version: sortByVersion }),
  withTranslation(),
)(NetworkPure);
