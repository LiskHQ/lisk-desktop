import http from 'src/utils/api/http';
import { HTTP_PREFIX } from 'src/const/httpCodes';

const httpPaths = {
  application: `${HTTP_PREFIX}/blockchain/apps`,
  filterOffChainApplications: `${HTTP_PREFIX}/blockchain/apps/meta`,
};

/**
 * Retrieves the details of a single blockchain application
 *
 * @param {Object} data
 * @param {String} data.params
 * @param {String} data.params.chainId - Id of the chain
 * @param {String?} data.baseUrl - Lisk Service API url to override the
 * existing ServiceUrl on the network param.
 * @param {Object} data.network - Network setting from Redux store
 * @returns {Promise} Blockchain application details API call
 */

export const getApplication = ({ params, network, baseUrl }) =>
  http({
    path: httpPaths.application,
    params,
    network,
    baseUrl,
  });

/**
 * Retrieves list of blockchain applications
 *
 * @param {Object} data
 * @param {String} data.params
 * @param {String} data.params.chainId - Id of the chain
 * @param {String?} data.baseUrl - Lisk Service API url to override the
 * existing ServiceUrl on the network param.
 * @param {Object} data.network - Network setting from Redux store
 * @returns {Promise} Blockchain application details API call
 */

// eslint-disable-next-line import/prefer-default-export
export const getApplications = ({ params, network, baseUrl }) =>
  http({
    path: httpPaths.application,
    params,
    network,
    baseUrl,
  });

/**
 * Retrieves list of blockchain applications with off-chain data
 *
 * @param {Object} data
 * @param {String} data.params
 * @param {String} data.params.chainId - Id of the chain
 * @param {String?} data.baseUrl - Lisk Service API url to override the
 * existing ServiceUrl on the network param.
 * @param {Object} data.network - Network setting from Redux store
 * @returns {Promise} Blockchain application details API call
 */

export const getFilteredOffChainApplications = ({ params, network, baseUrl }) =>
  http({
    path: httpPaths.filterOffChainApplications,
    params,
    network,
    baseUrl,
  });
