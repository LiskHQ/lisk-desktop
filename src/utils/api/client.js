/* istanbul ignore file */
import io from 'socket.io-client';
import axios from 'axios';
import { METHOD } from 'src/const/config';

export class Client {
  constructor(option) {
    if (option) {
      this.create(option);
    }
  }

  axiosConfig = {
    timeout: 10000,
  };

  socket = null;

  socketRPC = null;

  http = null;

  rpc = ({ event, params, data }) =>
    new Promise((resolve, reject) => {
      if (this.socketRPC.disconnected) {
        reject(new Error('socket not connected'));
        return;
      }
      this.socketRPC.emit(
        'request',
        { method: event, params: params || data || {} },
        (response) => {
          if (Object.keys(response).length && response.error) {
            return reject(response);
          }
          return resolve(response);
        }
      );
    });

  rest = (config) => this.http?.request({ ...this.http.defaults, ...config });

  call = ({ transformResult = async (data) => data, ...args }) => this[METHOD](args).then(transformResult);

  create({ ws, http } = {}) {
    if (ws) {
      this.socket = io(ws, { transports: ['websocket'], path: '/blockchain' });
      this.socketRPC = io(ws, { transports: ['websocket'], path: '/rpc-v3' });
    }
    if (http) {
      const request = axios.create({
        ...this.axiosConfig,
        baseURL: http,
      });
      request.interceptors.response.use((res) => res.data);
      this.http = request;
    }
  }
}

export default new Client();
