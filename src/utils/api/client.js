/* istanbul ignore file */
import io from 'socket.io-client';
import axios from 'axios';

export class Client {
  socket = null;

  axiosConfig = {
    timeout: 10000,
  };

  http = null;

  rpc = ({ event, params, data }) =>
    new Promise((resolve, reject) => {
      if (this.socket.disconnected) {
        reject(new Error('socket not connected'));
        return;
      }
      this.socket.emit('request', { method: event, params: params || data || {} }, (response) => {
        if (Object.keys(response).length && response.error) {
          return reject(response);
        }
        return resolve(response);
      });
    });

  rest = (config) => this.http?.request({ ...this.http.defaults, ...config });

  create({ rpc, rest }) {
    this.socket = io(rpc, { transports: ['websocket'] });
    const request = axios.create({
      ...this.axiosConfig,
      baseURL: rest,
    });
    request.interceptors.response.use((res) => res.data);
    this.http = request;
  }
}
export default new Client();
