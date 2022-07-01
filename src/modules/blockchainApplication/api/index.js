import http from '@common/utilities/api/http';
import { HTTP_PREFIX } from 'src/const/httpCodes';

const httpPaths = {
  application: `${HTTP_PREFIX}/blockchain/apps`,
};

/**
 * Retrieves the details of a single transaction
 *
 * @param {Object} data
 * @param {String} data.params
 * @param {String} data.params.id - Id of the transaction
 * @param {String?} data.baseUrl - Lisk Service API url to override the
 * existing ServiceUrl on the network param. We may use this to retrieve
 * the details of an archived transaction.
 * @param {Object} data.network - Network setting from Redux store
 * @returns {Promise} Transaction details API call
 */

// eslint-disable-next-line import/prefer-default-export
export const getApplication = ({
  params, network, baseUrl,
}) => http({
  path: httpPaths.application,
  params,
  network,
  baseUrl,
});
