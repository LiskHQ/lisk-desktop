import { subscribe, unsubscribe } from '../ws';

const wsMethods = {
  blocksChange: 'blocks/change',
};

export const getBlock = data => new Promise(resolve =>
  resolve({ endpoint: 'getBlock', token: 'shared', data }));

export const getBlocks = data => new Promise(resolve =>
  resolve({ endpoint: 'getBlocks', token: 'shared', data }));

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
