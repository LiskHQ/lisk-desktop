import React from 'react';
import { compose } from 'redux';
import { withTranslation } from 'react-i18next';

import withLocalSort from '@common/utilities/withLocalSort';
import { getNetworkStatistics, getPeers } from '@network/api';
import withData from '@common/utilities/withData';
import { tokenMap, DEFAULT_LIMIT } from '@common/configuration';
import Box from '@basics/box';
import BoxHeader from '@basics/box/header';
import BoxContent from '@basics/box/content';
import Tooltip from '@basics/tooltip/tooltip';
import Table from '@basics/table';
import styles from './network.css';
import header from './tableHeader';
import Map from './map';
import PeerRow from './peerRow';
import Overview from './overview';

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
  if (a.networkVersion === b.networkVersion) return 0;

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
  const aParts = split(a.networkVersion || '');
  const bParts = split(b.networkVersion || '');

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
              <p>{t('The list shown only contains peers connected to the current Lisk Service node.')}</p>
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
      apiUtil: (network, params) => getPeers({ network, params }, tokenMap.LSK.key),
      getApiParams: () => ({
        limit: DEFAULT_LIMIT,
      }),
      defaultData: [],
      autoload: true,
      transformResponse: (response, peers, urlSearchParams) => (
        urlSearchParams.offset
          ? [...peers, ...response.data]
          : response.data
      ),
    },
  }),
  withLocalSort('peers', 'height:desc', { networkVersion: sortByVersion }),
  withTranslation(),
)(NetworkPure);
