import http from 'src/utils/api/http';
import { transformStringDateToUnixTimestamp } from 'src/utils/dateTime';
import { httpPaths } from '@block/config';
import blocksFiltersMap from '@block/map/blocksFiltersMap';

/**
 * Retrieves blocks list.
 *
 * @param {Object} data
 * @param {Array<String>?} data.params.addressList - List of account addresses
 * @param {Date?} data.params.dateFrom - Starting timestamp
 * @param {Date?} data.params.dateTo - Ending timestamp
 * @param {String?} data.params.generator - Address or username of validator the generator
 * @param {Number?} data.params.offset - Index of the first result
 * @param {Number?} data.params.limit - Maximum number of results
 * @param {String?} data.baseUrl - Lisk Service API url to override the
 * existing ServiceUrl on the network param. We may use this to retrieve
 * the details of an archived transaction.
 * @param {Object} data.network - Network setting from Redux store
 * @returns {Promise} http call
 */

const getBlocks = ({
  params = {}, network, baseUrl,
}) => {
  if (typeof params.dateFrom === 'string') {
    params.dateFrom = transformStringDateToUnixTimestamp(params.dateFrom);
  }

  if (typeof params.dateTo === 'string') {
    params.dateTo = transformStringDateToUnixTimestamp(params.dateTo);
  }

  if (typeof params.generator === 'string') {
    params.generatorUsername = params.generator;
    params.generatorAddress = params.generator;
    delete params.generator;
  }

  const normParams = Object.keys(params).reduce((acc, key) => {
    if (blocksFiltersMap[key].test(params[key])) {
      acc[blocksFiltersMap[key].key] = params[key];
    }
    return acc;
  }, {});

  return http({
    path: httpPaths.blocks,
    params: normParams,
    network,
    baseUrl,
  });
};

export default getBlocks;
