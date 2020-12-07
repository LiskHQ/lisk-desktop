import io from 'socket.io-client';

const connections = {};

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

export const subscribe = (
  node,
  url,
  callback,
  onDisconnect,
  onReconnect,
) => {
  const connection = io.connect(node);
  connection.on(url, callback);
  connection.on('disconnect', onDisconnect);
  connection.on('reconnect', onReconnect);
  connections[url] = connection;
};

export const unsubscribe = (url) => {
  connections[url].close();
};

export default ws;
