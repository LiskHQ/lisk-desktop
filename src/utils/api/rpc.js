/* istanbul ignore file */
import client from 'src/utils/api/client';
/**
 * Makes RPC api call
 *
 * @param {string} event - api event end point
 * @param {string} params - HTTP call parameters
 * @param {string} data - HTTP call parameters
 * @returns {Promise} - if success it returns data,
 * if fails on server it throws an error,
 *
 */
const rpc = ({ event, params, data }) =>
  new Promise((resolve, reject) => {
    if (client.socket.disconnected) {
      reject(new Error('socket not connected'));
      return;
    }
    client.socket.emit('request', { method: event, params: params || data || {} }, (response) => {
      if (Object.keys(response).length && response.error) {
        return reject(response);
      }
      return resolve(response);
    });
  });

export default rpc;
