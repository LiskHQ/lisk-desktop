import { subscribe } from 'src/utils/api/ws';
import { wsMethods } from '@block/config';
/**
 * Connects to block change event via websocket and set function to be called when it fires
 *
 * @param {Object} network - Redux network state
 * @param {Function} callback - Function to be called when event fires
 * @param {Function} onDisconnect - Function to be called when disconnect event fires
 * @param {Function} onReconnect - Function to be called when reconnect event fires
 */
const blockSubscribe = (network, callback, onDisconnect, onReconnect) => {
  const node = network?.networks?.LSK?.serviceUrl;
  if (node) {
    subscribe(`${node}/blockchain`, wsMethods.blocksChange, callback, onDisconnect, onReconnect);
  }
};

export default blockSubscribe;
