import { subscribe, unsubscribe } from '../ws';
import http from '../http';

const httpPrefix = '/api/v1';

export const httpPaths = {
  block: `${httpPrefix}/blocks`,
  blocks: `${httpPrefix}/blocks`,
};

const wsMethods = {
  blocksChange: 'blocks/change',
};

/**
 * Retrieves block details.
 *
 * @param {Object} data
 * @param {String?} data.params.id - Block id
 * @param {String?} data.baseUrl - Lisk Service API url to override the
 * existing ServiceUrl on the network param. We may use this to retrieve
 * the details of an archived transaction.
 * @param {Object} data.network - Network setting from Redux store
 * @returns {Promise} http call
 */
export const getBlock = ({
  params = {}, network, baseUrl,
}) => http({
  path: httpPaths.block,
  params,
  network,
  baseUrl,
});

/**
 * Retrieves blocks list.
 *
 * @param {Object} data
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
}) => http({
  path: httpPaths.blocks,
  params,
  network,
  baseUrl,
});

/**
 * Connects to block change event via websocket and set function to be called when it fires
 *
 * @param {Object} network - Redux network state
 * @param {Function} callback - Function to be called when event fires
 * @param {Function} onDisconnect - Function to be called when disconnect event fires
 * @param {Function} onReconnect - Function to be called when reconnect event fires
 * @returns {Object} - Object containing a key with the event name and another object that stores
 *                     socket connection and fordecClosing status
 */
export const blockSubscribe = (network, callback, onDisconnect, onReconnect) => {
  const connection = subscribe(
    network.serviceUrl, wsMethods.blocksChange, callback, onDisconnect, onReconnect,
  );
  return ({
    [wsMethods.blocksChange]: {
      forcedClosing: false,
      connection,
    },
  });
};

/**
 * Disconnects from block change websocket event and deletes socket connection
 *
 * @param {Object} network - Redux network state
 * @param {Object} network.socketConnections - Stored socket connections
 * @returns {Object} - Socket connections
 */
export const blockUnsubscribe = ({ socketConnections }) => {
  unsubscribe(wsMethods.blocksChange, socketConnections);
  delete socketConnections[wsMethods.blocksChange];
  return socketConnections;
};
