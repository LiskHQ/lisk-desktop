/* istanbul ignore file */
import http from 'src/utils/api/http';
import { HTTP_PREFIX } from 'src/const/httpCodes';

const httpPaths = {
  blockchainApps: `${HTTP_PREFIX}/blockchain/apps`,
  blockchainAppsStatistics: `${HTTP_PREFIX}/blockchain/apps/statistics`,
};

/**
 * Retrieves sidechains applications information
 *
 * @param {Object} data
 * @param {String?} data.baseUrl Custom API URL
 * @param {Object} data.network The network config from the Redux store
 * @param {String?} data.params.limit Used for pagination
 * @param {String?} data.params.offset Used for pagination
 *
 * @returns {Promise}
 */
export const getApps = ({
  network,
  params = {},
  baseUrl,
}) => http({
  path: httpPaths.blockchainApps,
  network,
  params,
  baseUrl,
});

/**
 * Retrieves sidechains statistics information
 *
 * @param {Object} data
 * @param {Object} data.network The network config from the Redux store
 *
 * @returns {Promise}
 */
export const getStatistics = ({
  network,
  params = {},
  baseUrl,
}) => http({
  path: httpPaths.blockchainAppsStatistics,
  network,
  params,
  baseUrl,
});
