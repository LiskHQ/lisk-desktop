/* istanbul ignore file */
import http from 'src/utils/api/http';
import { HTTP_PREFIX } from 'src/const/httpCodes';

const httpPaths = {
  blockchainAppsStatistics: `${HTTP_PREFIX}/blockchain/apps/statistics`,
};

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
