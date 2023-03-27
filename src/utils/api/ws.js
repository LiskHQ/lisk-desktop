import io from 'socket.io-client';

export const subscribeConnections = {};

/**
 * A generic function to handle WS requests.
 *
 * @param {Object[]} requests
 * @param {String} request[].method - The JSON RPC API method name
 * @param {Object} request[].params - The parameters passed for a single request
 * @param {String} baseUrl - Lisk Service base URL
 * @returns {Promise}
 */
const ws = ({ baseUrl, requests }) =>
  new Promise((resolve, reject) => {
    const uri = `${baseUrl.replace('http', 'ws')}/rpc-v3`;
    const socket = io(uri, {
      transports: ['websocket'],
    });

    socket.emit('request', requests, (response) => {
      if (response.error) reject(response.error);
      else {
        if (!Array.isArray(response)) resolve(response.result);
        const normRes = response.reduce(
          (acc, res) => {
            res.result.data.forEach((item) => acc.data.push(item));
            acc.meta.count += res.result.meta.count;
            acc.meta.offset = res.result.meta.offset;
            return acc;
          },
          {
            data: [],
            meta: {
              count: 0,
              offset: 0,
            },
          }
        );

        resolve(normRes);
      }
    });
  });

/**
 * Connect to an event and set function to be called when it fires
 *
 * @param {String} node - Service URL
 * @param {String} eventName - Event to subscribe
 * @param {Function} callback - Function to be called when event fires
 * @param {Function} onDisconnect - Function to be called when disconnect event fires
 * @param {Function} onReconnect - Function to be called when reconnect event fires
 */
export const subscribe = (node, eventName, callback, onDisconnect, onReconnect) => {
  const connection = io(node, {
    forceNew: true,
    transports: ['websocket'],
  });
  connection.on(eventName, callback);
  connection.on('reconnect', onReconnect);
  connection.on('disconnect', () => {
    if (subscribeConnections[eventName] && !subscribeConnections[eventName].forcedClosing) {
      onDisconnect();
    }
  });
  subscribeConnections[eventName] = { connection, forcedClosing: false };
};

/**
 * Close event connection
 *
 * @param {String} eventName - Event to unsubscribe
 */
export const unsubscribe = (eventName) => {
  const eventConnection = subscribeConnections[eventName];
  if (eventConnection) {
    eventConnection.forcedClosing = true;
    eventConnection.connection.close();
    eventConnection.forcedClosing = false;
    delete subscribeConnections[eventName];
  }
};

export default ws;
