import { tokenMap } from '@common/configuration';
import { subscribe, unsubscribe } from '../ws';
import http from '../http';
import { validateAddress } from '../../validators';
import { transformStringDateToUnixTimestamp } from '../../datetime';

const httpPrefix = '/api/v2';

export const httpPaths = {
  block: `${httpPrefix}/blocks`,
  blocks: `${httpPrefix}/blocks`,
};

const wsMethods = {
  blocksChange: 'update.block',
};

const getBlockProps = ({ blockId, height }) => {
  if (blockId) return { blockId };
  if (height) return { height };
  throw Error('No parameters supplied');
};

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
export const getBlock = ({
  params = {}, network, baseUrl,
}) => {
  try {
    const blockProps = getBlockProps(params);
    return http({
      path: httpPaths.block,
      params: blockProps,
      network,
      baseUrl,
    });
  } catch (e) {
    return Promise.reject(e);
  }
};

const blocksFilters = {
  addressList: { key: 'addressList', test: addressList => !addressList.some(address => validateAddress(tokenMap.LSK.key, address)) },
  timestamp: { key: 'timestamp', test: str => /^(\d+)?:(\d+)?$/.test(str) },
  generatorAddress: { key: 'generatorAddress', test: address => !validateAddress(tokenMap.LSK.key, address) },
  generatorUsername: { key: 'generatorUsername', test: username => (typeof username === 'string' && validateAddress(tokenMap.LSK.key, username) === 1) },
  height: { key: 'height', test: num => !Number.isNaN(parseInt(num, 10)) },
  limit: { key: 'limit', test: num => (typeof num === 'number') },
  offset: { key: 'offset', test: num => (typeof num === 'number' && num > 0) },
  sort: {
    key: 'sort',
    test: str => [
      'height:asc', 'height:desc', 'totalAmount:asc', 'totalAmount:desc', 'totalFee:asc', 'totalFee:desc', 'timestamp:asc', 'timestamp:desc',
    ].includes(str),
  },
};

/**
 * Retrieves blocks list.
 *
 * @param {Object} data
 * @param {Array<String>?} data.params.addressList - List of account addresses
 * @param {Date?} data.params.dateFrom - Starting timestamp
 * @param {Date?} data.params.dateTo - Ending timestamp
 * @param {String?} data.params.generator - Address or username of delegate the forger
 * @param {Number?} data.params.offset - Index of the first result
 * @param {Number?} data.params.limit - Maximum number of results
 * @param {String?} data.baseUrl - Lisk Service API url to override the
 * existing ServiceUrl on the network param. We may use this to retrieve
 * the details of an archived transaction.
 * @param {Object} data.network - Network setting from Redux store
 * @returns {Promise} http call
 */
export const getBlocks = ({
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
    if (blocksFilters[key].test(params[key])) {
      acc[blocksFilters[key].key] = params[key];
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

/**
 * Connects to block change event via websocket and set function to be called when it fires
 *
 * @param {Object} network - Redux network state
 * @param {Function} callback - Function to be called when event fires
 * @param {Function} onDisconnect - Function to be called when disconnect event fires
 * @param {Function} onReconnect - Function to be called when reconnect event fires
 */
export const blockSubscribe = (network, callback, onDisconnect, onReconnect) => {
  const node = network?.networks?.LSK?.serviceUrl;
  if (node) {
    subscribe(
      `${node}/blockchain`, wsMethods.blocksChange, callback, onDisconnect, onReconnect,
    );
  }
};

/**
 * Disconnects from block change websocket event and deletes socket connection
 *
 * @param {Object} network - Redux network state
 */
export const blockUnsubscribe = () => {
  unsubscribe(wsMethods.blocksChange);
};
