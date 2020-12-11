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
 */
export const blockSubscribe = (network, callback, onDisconnect, onReconnect) => {
  subscribe(network.serviceUrl, wsMethods.blocksChange, callback, onDisconnect, onReconnect);
};

/**
 * Disconnects from block change websocket event
 */
export const blockUnsubscribe = () => {
  unsubscribe(wsMethods.blocksChange);
};
