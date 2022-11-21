import defaultClient from 'src/utils/api/client';
import { METHOD } from 'src/const/config';

/**
 * Retrieves block details.
 *
 * @param {Object} data
 * @param {String?} data.params.blockId - Block id
 * @param {Number?} data.params.height - Block height
 * @param {String?} data.baseUrl - Lisk Service API url to override the
 * existing ServiceUrl on the network param. We may use this to retrieve
 * the details of an archived transaction.
 * @param {Object} data.network - Network setting from Redux store
 * @returns {Promise} http call
 */
const getBlock = ({ params = {} }) => {
  try {
    return defaultClient[METHOD]({ params });
  } catch (e) {
    return Promise.reject(e);
  }
};

export default getBlock;
