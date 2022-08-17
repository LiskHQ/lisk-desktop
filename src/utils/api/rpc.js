import socket from 'src/utils/api/socket';
/**
 * Makes RPC api call
 *
 * @param {string} event - api event end point
 * @param {string} params - HTTP call parameters
 * @returns {Promise} - if success it returns data,
 * if fails on server it throws an error,
 *
 */
const rpc = ({
  event,
  params,
}) => new Promise((resolve, reject) => {
  if (socket.client.disconnected) {
    reject(new Error('socket not connected'));
    return;
  }
  socket.client.emit(event, params || {}, (response) => {
    if (Object.keys(response).length && response.error) {
      return reject(response);
    }
    return resolve(response);
  });
});

export default rpc;
