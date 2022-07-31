import http from 'src/utils/api/http';
import { HTTP_PREFIX } from 'src/const/httpCodes';

const httpPaths = {
  tokens: `${HTTP_PREFIX}/blockchain/apps/meta/tokens`,
};

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

// eslint-disable-next-line import/prefer-default-export
export const getTokens = ({
  params, network, baseUrl,
}) => http({
  path: httpPaths.filterOffChainApplications,
  params,
  network,
  baseUrl,
});
