import { subscribe } from '@common/utilities/api/ws';
import { wsMethods } from '../../constants/constants';

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
