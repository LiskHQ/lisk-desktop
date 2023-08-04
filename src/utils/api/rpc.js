/* istanbul ignore file */
import client from 'src/utils/api/client';

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
