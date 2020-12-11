import io from 'socket.io-client';

const connections = {};
const forcedClosings = {};

/**
 * A generic function to handle WS requests.
 *
 * @param {Object[]} requests
 * @param {String} request[].method - The JSON RPC API method name
 * @param {Object} request[].params - The parameters passed for a single request
 * @param {String} baseUrl - Lisk Service base URL
 * @returns {Promise}
 */
const ws = ({
  baseUrl, requests,
}) => new Promise((resolve, reject) => {
  const socket = io(
    `${baseUrl}/rpc`,
    {
      transports: ['websocket'],
    },
  );

  socket.emit('request', requests, (response) => {
    if (response.error) reject(response.error);

    else {
      resolve(Array.isArray(response) ? response : response.result);
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
export const subscribe = (
  node,
  eventName,
  callback,
  onDisconnect,
  onReconnect,
) => {
  const connection = io.connect(node);
  connections[eventName] = connection;
  forcedClosings[eventName] = false;
  connection.on(eventName, callback);
  connection.on('reconnect', onReconnect);
  connection.on('disconnect', () => {
    if (!forcedClosings[eventName]) {
      onDisconnect();
    }
  });
};

/**
 * Close event connection
 *
 * @param {String} eventName - Event to unsubscribe
 */
export const unsubscribe = (eventName) => {
  if (connections[eventName]) {
    forcedClosings[eventName] = true;
    connections[eventName].close();
    forcedClosings[eventName] = false;
    delete connections[eventName];
    delete forcedClosings[eventName];
  }
};

export default ws;
