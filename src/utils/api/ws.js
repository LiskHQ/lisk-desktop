import io from 'socket.io-client';

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

export default ws;
