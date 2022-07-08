import http from 'src/utils/api/http';
import { HTTP_PREFIX } from 'src/const/httpCodes';

const httpPaths = {
  application: `${HTTP_PREFIX}/blockchain/apps`,
};

/**
 * Retrieves the list of blockchain applications
 *
 * @param {Object} data
 * @param {String} data.params
 * @param {Number} data.params.limit - Number of applications to fetch
 * @param {Number} data.params.offset - Index of the first application
 * @param {String?} data.baseUrl - Lisk Service API url to override the
 * existing ServiceUrl on the network param
 * @param {Object} data.network - Network setting from Redux store
 * @returns {Promise} Blockchain application details API call
 */

// eslint-disable-next-line import/prefer-default-export
export const getApplications = ({
  params, network, baseUrl,
}) => http({
  path: httpPaths.application,
  params,
  network,
  baseUrl,
});
